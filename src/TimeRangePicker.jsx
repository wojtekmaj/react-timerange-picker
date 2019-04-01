import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import makeEventProps from 'make-event-props';
import mergeClassNames from 'merge-class-names';
import Fit from 'react-fit';

import Clock from 'react-clock/dist/entry.nostyle';

import TimeInput from 'react-time-picker/dist/TimeInput';

import { isTime } from './shared/propTypes';
import { callIfDefined } from './shared/utils';

const allViews = ['hour', 'minute', 'second'];
const baseClassName = 'react-timerange-picker';

export default class TimeRangePicker extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isOpen !== prevState.isOpenProps) {
      return {
        isOpen: nextProps.isOpen,
        isOpenProps: nextProps.isOpen,
      };
    }

    return null;
  }

  state = {};

  get eventProps() {
    return makeEventProps(this.props);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onOutsideAction);
    document.addEventListener('focusin', this.onOutsideAction);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;
    const { onClockClose, onClockOpen } = this.props;

    if (isOpen !== prevState.isOpen) {
      callIfDefined(isOpen ? onClockOpen : onClockClose);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onOutsideAction);
    document.removeEventListener('focusin', this.onOutsideAction);
  }

  onOutsideAction = (event) => {
    if (this.wrapper && !this.wrapper.contains(event.target)) {
      this.closeClock();
    }
  }

  onChange = (value, closeClock = true) => {
    this.setState({
      isOpen: !closeClock,
    });

    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  }

  onChangeFrom = (valueFrom, closeClock = true) => {
    const { value } = this.props;
    const [, valueTo] = [].concat(value);
    this.onChange([valueFrom, valueTo], closeClock);
  }

  onChangeTo = (valueTo, closeClock = true) => {
    const { value } = this.props;
    const [valueFrom] = [].concat(value);
    this.onChange([valueFrom, valueTo], closeClock);
  }

  onFocus = (event) => {
    const { disabled, onFocus } = this.props;

    if (onFocus) {
      onFocus(event);
    }

    // Internet Explorer still fires onFocus on disabled elements
    if (disabled) {
      return;
    }

    this.openClock();
  }

  openClock = () => {
    this.setState({ isOpen: true });
  }

  closeClock = () => {
    this.setState((prevState) => {
      if (!prevState.isOpen) {
        return null;
      }

      return { isOpen: false };
    });
  }

  toggleClock = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  stopPropagation = event => event.stopPropagation();

  clear = () => this.onChange(null);

  renderInputs() {
    const {
      clearIcon,
      clockIcon,
      disableClock,
      disabled,
      format,
      isOpen,
      locale,
      maxDetail,
      maxTime,
      minTime,
      name,
      required,
      showLeadingZeros,
      value,
    } = this.props;

    const [valueFrom, valueTo] = [].concat(value);

    const commonProps = {
      className: `${baseClassName}__inputGroup`,
      disabled,
      format,
      isOpen,
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
          name={`${name}_from`}
          onChange={this.onChangeFrom}
          returnValue="start"
          value={valueFrom}
        />
        –
        <TimeInput
          {...commonProps}
          name={`${name}_to`}
          onChange={this.onChangeTo}
          returnValue="end"
          value={valueTo}
        />
        {clearIcon !== null && (
          <button
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.clear}
            onFocus={this.stopPropagation}
            type="button"
          >
            {clearIcon}
          </button>
        )}
        {clockIcon !== null && !disableClock && (
          <button
            className={`${baseClassName}__clock-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.toggleClock}
            onFocus={this.stopPropagation}
            onBlur={this.resetValue}
            type="button"
          >
            {clockIcon}
          </button>
        )}
      </div>
    );
  }

  renderClock() {
    const { disableClock } = this.props;
    const { isOpen } = this.state;

    if (isOpen === null || disableClock) {
      return null;
    }

    const {
      clockClassName,
      className: timeRangePickerClassName, // Unused, here to exclude it from clockProps
      maxDetail,
      onChange,
      value: timeRangePickerValue,
      ...clockProps
    } = this.props;

    const className = `${baseClassName}__clock`;

    const maxDetailIndex = allViews.indexOf(maxDetail);

    const value = [].concat(timeRangePickerValue)[0]; // TODO: Show clock for "date to" inputs

    return (
      <Fit>
        <div className={mergeClassNames(className, `${className}--${isOpen ? 'open' : 'closed'}`)}>
          <Clock
            className={clockClassName}
            renderMinuteHand={maxDetailIndex > 0}
            renderSecondHand={maxDetailIndex > 1}
            value={value}
            {...clockProps}
          />
        </div>
      </Fit>
    );
  }

  render() {
    const { className, disabled } = this.props;
    const { isOpen } = this.state;

    return (
      <div
        className={mergeClassNames(
          baseClassName,
          `${baseClassName}--${isOpen ? 'open' : 'closed'}`,
          `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
          className,
        )}
        {...this.eventProps}
        onFocus={this.onFocus}
        ref={(ref) => {
          if (!ref) {
            return;
          }

          this.wrapper = ref;
        }}
      >
        {this.renderInputs()}
        {this.renderClock()}
      </div>
    );
  }
}

const ClearIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
    <g stroke="black" strokeWidth="2">
      <line x1="4" y1="4" x2="15" y2="15" />
      <line x1="15" y1="4" x2="4" y2="15" />
    </g>
  </svg>
);

TimeRangePicker.defaultProps = {
  clearIcon: ClearIcon,
  isOpen: null,
  maxDetail: 'minute',
  name: 'timerange',
};

TimeRangePicker.propTypes = {
  ...Clock.propTypes,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  clearIcon: PropTypes.node,
  clockClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  clockIcon: PropTypes.node,
  disableClock: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  isOpen: PropTypes.bool,
  maxDetail: PropTypes.oneOf(allViews),
  name: PropTypes.string,
  onChange: PropTypes.func,
  onClockClose: PropTypes.func,
  onClockOpen: PropTypes.func,
  required: PropTypes.bool,
  showLeadingZeros: PropTypes.bool,
  value: PropTypes.oneOfType([
    isTime,
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.oneOfType([
      isTime,
      PropTypes.instanceOf(Date),
    ])),
  ]),
};

polyfill(TimeRangePicker);
