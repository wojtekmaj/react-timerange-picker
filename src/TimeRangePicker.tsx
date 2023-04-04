import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import makeEventProps from 'make-event-props';
import clsx from 'clsx';
import Clock from 'react-clock';
import Fit from 'react-fit';

import TimeInput from 'react-time-picker/dist/cjs/TimeInput';

import { isTime } from './shared/propTypes';

import type { ClassName, Detail, LooseValue, Value } from './shared/types';

const baseClassName = 'react-timerange-picker';
const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'];
const allViews = ['hour', 'minute', 'second'];

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 19,
  height: 19,
  viewBox: '0 0 19 19',
  stroke: 'black',
  strokeWidth: 2,
};

const ClockIcon = (
  <svg
    {...iconProps}
    className={`${baseClassName}__clock-button__icon ${baseClassName}__button__icon`}
    fill="none"
  >
    <circle cx="9.5" cy="9.5" r="7.5" />
    <path d="M9.5 4.5 v5 h4" />
  </svg>
);

const ClearIcon = (
  <svg
    {...iconProps}
    className={`${baseClassName}__clear-button__icon ${baseClassName}__button__icon`}
  >
    <line x1="4" x2="15" y1="4" y2="15" />
    <line x1="15" x2="4" y1="4" y2="15" />
  </svg>
);

type Icon = React.ReactElement | string;

type IconOrRenderFunction = Icon | React.ComponentType | React.ReactElement;

type TimeRangePickerProps = {
  amPmAriaLabel?: string;
  autoFocus?: boolean;
  className?: ClassName;
  clearAriaLabel?: string;
  clearIcon?: IconOrRenderFunction;
  clockAriaLabel?: string;
  clockClassName?: ClassName;
  clockIcon?: IconOrRenderFunction;
  closeClock?: boolean;
  'data-testid'?: string;
  disableClock?: boolean;
  disabled?: boolean;
  format?: string;
  hourAriaLabel?: string;
  hourPlaceholder?: string;
  id?: string;
  isOpen?: boolean;
  locale?: string;
  maxDetail?: Detail;
  maxTime?: string;
  minTime?: string;
  minuteAriaLabel?: string;
  minutePlaceholder?: string;
  name?: string;
  nativeInputAriaLabel?: string;
  onChange?: (value: Value) => void;
  onClockClose?: () => void;
  onClockOpen?: () => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  openClockOnFocus?: boolean;
  portalContainer?: HTMLElement | null;
  rangeDivider?: React.ReactNode;
  required?: boolean;
  secondAriaLabel?: string;
  secondPlaceholder?: string;
  showLeadingZeros?: boolean;
  value?: LooseValue;
};

export default function TimeRangePicker(props: TimeRangePickerProps) {
  const {
    amPmAriaLabel,
    autoFocus,
    className,
    clearAriaLabel,
    clearIcon = ClearIcon,
    clockAriaLabel,
    clockIcon = ClockIcon,
    closeClock: shouldCloseClockProps = true,
    'data-testid': dataTestid,
    disableClock,
    disabled,
    format,
    hourAriaLabel,
    hourPlaceholder,
    id,
    isOpen: isOpenProps = null,
    locale,
    maxDetail = 'minute',
    maxTime,
    minTime,
    minuteAriaLabel,
    minutePlaceholder,
    name = 'timerange',
    nativeInputAriaLabel,
    onChange: onChangeProps,
    onClockClose,
    onClockOpen,
    onFocus: onFocusProps,
    openClockOnFocus = true,
    rangeDivider = '–',
    required,
    secondAriaLabel,
    secondPlaceholder,
    showLeadingZeros,
    value,
    ...otherProps
  } = props;

  const [isOpen, setIsOpen] = useState(isOpenProps);
  const wrapper = useRef<HTMLDivElement>(null);
  const clockWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(isOpenProps);
  }, [isOpenProps]);

  function openClock() {
    setIsOpen(true);

    if (onClockOpen) {
      onClockOpen();
    }
  }

  const closeClock = useCallback(() => {
    setIsOpen(false);

    if (onClockClose) {
      onClockClose();
    }
  }, [onClockClose]);

  function toggleClock() {
    if (isOpen) {
      closeClock();
    } else {
      openClock();
    }
  }

  function onChange(value: Value, shouldCloseClock = shouldCloseClockProps) {
    if (shouldCloseClock) {
      closeClock();
    }

    if (onChangeProps) {
      onChangeProps(value);
    }
  }

  function onChangeFrom(valueFrom: string | null, closeClock: boolean) {
    const [, valueTo] = Array.isArray(value) ? value : [value];

    onChange([valueFrom, valueTo || null], closeClock);
  }

  function onChangeTo(valueTo: string | null, closeClock: boolean) {
    const [valueFrom] = Array.isArray(value) ? value : [value];

    onChange([valueFrom || null, valueTo], closeClock);
  }

  function onFocus(event: React.FocusEvent<HTMLInputElement>) {
    if (onFocusProps) {
      onFocusProps(event);
    }

    if (
      // Internet Explorer still fires onFocus on disabled elements
      disabled ||
      isOpen ||
      !openClockOnFocus ||
      event.target.dataset.select === 'true'
    ) {
      return;
    }

    openClock();
  }

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeClock();
      }
    },
    [closeClock],
  );

  function clear() {
    onChange(null);
  }

  function stopPropagation(event: React.FocusEvent) {
    event.stopPropagation();
  }

  const onOutsideAction = useCallback(
    (event: Event) => {
      const { current: wrapperEl } = wrapper;
      const { current: clockWrapperEl } = clockWrapper;

      // Try event.composedPath first to handle clicks inside a Shadow DOM.
      const target = (
        'composedPath' in event ? event.composedPath()[0] : (event as Event).target
      ) as HTMLElement;

      if (
        target &&
        wrapperEl &&
        !wrapperEl.contains(target) &&
        (!clockWrapperEl || !clockWrapperEl.contains(target))
      ) {
        closeClock();
      }
    },
    [clockWrapper, closeClock, wrapper],
  );

  const handleOutsideActionListeners = useCallback(
    (shouldListen = isOpen) => {
      outsideActionEvents.forEach((event) => {
        if (shouldListen) {
          document.addEventListener(event, onOutsideAction);
        } else {
          document.removeEventListener(event, onOutsideAction);
        }
      });

      if (shouldListen) {
        document.addEventListener('keydown', onKeyDown);
      } else {
        document.removeEventListener('keydown', onKeyDown);
      }
    },
    [isOpen, onOutsideAction, onKeyDown],
  );

  useEffect(() => {
    handleOutsideActionListeners();

    return () => {
      handleOutsideActionListeners(false);
    };
  }, [handleOutsideActionListeners, isOpen]);

  function renderInputs() {
    const [valueFrom, valueTo] = Array.isArray(value) ? value : [value];

    const ariaLabelProps = {
      amPmAriaLabel,
      hourAriaLabel,
      minuteAriaLabel,
      nativeInputAriaLabel,
      secondAriaLabel,
    };

    const placeholderProps = {
      hourPlaceholder,
      minutePlaceholder,
      secondPlaceholder,
    };

    const commonProps = {
      ...ariaLabelProps,
      ...placeholderProps,
      className: `${baseClassName}__inputGroup`,
      disabled,
      format,
      isClockOpen: isOpen,
      locale,
      maxDetail,
      maxTime,
      minTime,
      required,
      showLeadingZeros,
    };

    return (
      <div className={`${baseClassName}__wrapper`}>
        <TimeInput
          {...commonProps}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          name={`${name}_from`}
          onChange={onChangeFrom}
          value={valueFrom}
        />
        <span className={`${baseClassName}__range-divider`}>{rangeDivider}</span>
        <TimeInput {...commonProps} name={`${name}_to`} onChange={onChangeTo} value={valueTo} />
        {clearIcon !== null && (
          <button
            aria-label={clearAriaLabel}
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={clear}
            onFocus={stopPropagation}
            type="button"
          >
            {typeof clearIcon === 'function' ? React.createElement(clearIcon) : clearIcon}
          </button>
        )}
        {clockIcon !== null && !disableClock && (
          <button
            aria-label={clockAriaLabel}
            className={`${baseClassName}__clock-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={toggleClock}
            onFocus={stopPropagation}
            type="button"
          >
            {typeof clockIcon === 'function' ? React.createElement(clockIcon) : clockIcon}
          </button>
        )}
      </div>
    );
  }

  function renderClock() {
    if (isOpen === null || disableClock) {
      return null;
    }

    const {
      clockClassName,
      className: timeRangePickerClassName, // Unused, here to exclude it from clockProps
      onChange: onChangeProps, // Unused, here to exclude it from clockProps
      portalContainer,
      value,
      ...clockProps
    } = props;

    const className = `${baseClassName}__clock`;
    const classNames = clsx(className, `${className}--${isOpen ? 'open' : 'closed'}`);

    const [valueFrom] = Array.isArray(value) ? value : [value];

    const clock = <Clock className={clockClassName} value={valueFrom} {...clockProps} />;

    return portalContainer ? (
      createPortal(
        <div ref={clockWrapper} className={classNames}>
          {clock}
        </div>,
        portalContainer,
      )
    ) : (
      <Fit>
        <div
          ref={(ref) => {
            if (ref && !isOpen) {
              ref.removeAttribute('style');
            }
          }}
          className={classNames}
        >
          {clock}
        </div>
      </Fit>
    );
  }

  const eventProps = useMemo(() => makeEventProps(otherProps), [otherProps]);

  return (
    <div
      className={clsx(
        baseClassName,
        `${baseClassName}--${isOpen ? 'open' : 'closed'}`,
        `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
        className,
      )}
      data-testid={dataTestid}
      id={id}
      {...eventProps}
      onFocus={onFocus}
      ref={wrapper}
    >
      {renderInputs()}
      {renderClock()}
    </div>
  );
}

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

const isValueOrValueArray = PropTypes.oneOfType([isValue, PropTypes.arrayOf(isValue)]);

TimeRangePicker.propTypes = {
  amPmAriaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  clearAriaLabel: PropTypes.string,
  clearIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  clockAriaLabel: PropTypes.string,
  clockClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  clockIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  closeClock: PropTypes.bool,
  'data-testid': PropTypes.string,
  disableClock: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  hourAriaLabel: PropTypes.string,
  hourPlaceholder: PropTypes.string,
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDetail: PropTypes.oneOf(allViews),
  maxTime: isTime,
  minTime: isTime,
  minuteAriaLabel: PropTypes.string,
  minutePlaceholder: PropTypes.string,
  name: PropTypes.string,
  nativeInputAriaLabel: PropTypes.string,
  onChange: PropTypes.func,
  onClockClose: PropTypes.func,
  onClockOpen: PropTypes.func,
  onFocus: PropTypes.func,
  openClockOnFocus: PropTypes.bool,
  portalContainer: PropTypes.object,
  rangeDivider: PropTypes.node,
  required: PropTypes.bool,
  secondAriaLabel: PropTypes.string,
  secondPlaceholder: PropTypes.string,
  showLeadingZeros: PropTypes.bool,
  value: isValueOrValueArray,
};
