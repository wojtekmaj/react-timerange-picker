import { describe, expect, it, vi } from 'vitest';
import React, { createRef } from 'react';
import { act, fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TimeRangePicker from './TimeRangePicker';

async function waitForElementToBeRemovedOrHidden(callback) {
  const element = callback();

  if (element) {
    try {
      await waitFor(() =>
        expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
      );
    } catch (error) {
      await waitForElementToBeRemoved(element);
    }
  }
}

describe('TimeRangePicker', () => {
  it('passes default name to TimeInput components', () => {
    const { container } = render(<TimeRangePicker />);

    const nativeInputs = container.querySelectorAll('input[type="time"]');

    expect(nativeInputs[0]).toHaveAttribute('name', 'timerange_from');
    expect(nativeInputs[1]).toHaveAttribute('name', 'timerange_to');
  });

  it('passes custom name to TimeInput components', () => {
    const name = 'testName';

    const { container } = render(<TimeRangePicker name={name} />);

    const nativeInputs = container.querySelectorAll('input[type="time"]');

    expect(nativeInputs[0]).toHaveAttribute('name', `${name}_from`);
    expect(nativeInputs[1]).toHaveAttribute('name', `${name}_to`);
  });

  // See https://github.com/jsdom/jsdom/issues/3041
  it.skip('passes autoFocus flag to first TimeInput component', () => {
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { container } = render(<TimeRangePicker autoFocus />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('autofocus');
  });

  it('passes disabled flag to TimeInput components', () => {
    const { container } = render(<TimeRangePicker disabled />);

    const nativeInputs = container.querySelectorAll('input[type="time"]');

    expect(nativeInputs[0]).toBeDisabled();
    expect(nativeInputs[1]).toBeDisabled();
  });

  it('passes format to TimeInput components', () => {
    const { container } = render(<TimeRangePicker format="ss" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs).toHaveLength(2);
    expect(customInputs[0]).toHaveAttribute('name', 'second');
    expect(customInputs[1]).toHaveAttribute('name', 'second');
  });

  it('passes aria-label props to TimeInput components', () => {
    const ariaLabelProps = {
      amPmAriaLabel: 'Select AM/PM',
      clearAriaLabel: 'Clear value',
      clockAriaLabel: 'Toggle clock',
      hourAriaLabel: 'Hour',
      minuteAriaLabel: 'Minute',
      nativeInputAriaLabel: 'Time',
      secondAriaLabel: 'Second',
    };

    const { container } = render(<TimeRangePicker {...ariaLabelProps} maxDetail="second" />);

    const clockButton = container.querySelector('button.react-timerange-picker__clock-button');
    const clearButton = container.querySelector('button.react-timerange-picker__clear-button');
    const timeInputs = container.querySelectorAll('.react-timerange-picker__inputGroup');

    const [timeFromInput, timeToInput] = timeInputs;

    const nativeFromInput = timeFromInput.querySelector('input[type="time"]');
    const hourFromInput = timeFromInput.querySelector('input[name="hour12"]');
    const minuteFromInput = timeFromInput.querySelector('input[name="minute"]');
    const secondFromInput = timeFromInput.querySelector('input[name="second"]');

    const nativeToInput = timeToInput.querySelector('input[type="time"]');
    const hourToInput = timeToInput.querySelector('input[name="hour12"]');
    const minuteToInput = timeToInput.querySelector('input[name="minute"]');
    const secondToInput = timeToInput.querySelector('input[name="second"]');

    expect(clockButton).toHaveAttribute('aria-label', ariaLabelProps.clockAriaLabel);
    expect(clearButton).toHaveAttribute('aria-label', ariaLabelProps.clearAriaLabel);

    expect(nativeFromInput).toHaveAttribute('aria-label', ariaLabelProps.nativeInputAriaLabel);
    expect(hourFromInput).toHaveAttribute('aria-label', ariaLabelProps.hourAriaLabel);
    expect(minuteFromInput).toHaveAttribute('aria-label', ariaLabelProps.minuteAriaLabel);
    expect(secondFromInput).toHaveAttribute('aria-label', ariaLabelProps.secondAriaLabel);

    expect(nativeToInput).toHaveAttribute('aria-label', ariaLabelProps.nativeInputAriaLabel);
    expect(hourToInput).toHaveAttribute('aria-label', ariaLabelProps.hourAriaLabel);
    expect(minuteToInput).toHaveAttribute('aria-label', ariaLabelProps.minuteAriaLabel);
    expect(secondToInput).toHaveAttribute('aria-label', ariaLabelProps.secondAriaLabel);
  });

  it('passes placeholder props to TimeInput components', () => {
    const placeholderProps = {
      hourPlaceholder: 'hh',
      minutePlaceholder: 'mm',
      secondPlaceholder: 'ss',
    };

    const { container } = render(<TimeRangePicker {...placeholderProps} maxDetail="second" />);

    const timeInputs = container.querySelectorAll('.react-timerange-picker__inputGroup');

    const [timeFromInput, timeToInput] = timeInputs;

    const hourFromInput = timeFromInput.querySelector('input[name="hour12"]');
    const minuteFromInput = timeFromInput.querySelector('input[name="minute"]');
    const secondFromInput = timeFromInput.querySelector('input[name="second"]');

    const hourToInput = timeToInput.querySelector('input[name="hour12"]');
    const minuteToInput = timeToInput.querySelector('input[name="minute"]');
    const secondToInput = timeToInput.querySelector('input[name="second"]');

    expect(hourFromInput).toHaveAttribute('placeholder', placeholderProps.hourPlaceholder);
    expect(minuteFromInput).toHaveAttribute('placeholder', placeholderProps.minutePlaceholder);
    expect(secondFromInput).toHaveAttribute('placeholder', placeholderProps.secondPlaceholder);

    expect(hourToInput).toHaveAttribute('placeholder', placeholderProps.hourPlaceholder);
    expect(minuteToInput).toHaveAttribute('placeholder', placeholderProps.minutePlaceholder);
    expect(secondToInput).toHaveAttribute('placeholder', placeholderProps.secondPlaceholder);
  });

  describe('passes value to TimeInput components', () => {
    it('passes single value to TimeInput components', () => {
      const value = new Date(2019, 0, 1);

      const { container } = render(<TimeRangePicker value={value} />);

      const nativeInputs = container.querySelectorAll('input[type="time"]');

      expect(nativeInputs[0]).toHaveValue('00:00');
      expect(nativeInputs[1]).toHaveValue('');
    });

    it('passes the first item of an array of values to TimeInput components', () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1, 12, 30);

      const { container } = render(<TimeRangePicker value={[value1, value2]} />);

      const nativeInputs = container.querySelectorAll('input[type="time"]');

      expect(nativeInputs[0]).toHaveValue('00:00');
      expect(nativeInputs[1]).toHaveValue('12:30');
    });
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const { container } = render(<TimeRangePicker className={className} />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isOpen flag', () => {
    const { container } = render(<TimeRangePicker isOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-timerange-picker--open');
  });

  it('applies clockClassName to the clock when given a string', () => {
    const clockClassName = 'testClassName';

    const { container } = render(<TimeRangePicker clockClassName={clockClassName} isOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toHaveClass(clockClassName);
  });

  it('renders TimeInput components', () => {
    const { container } = render(<TimeRangePicker />);

    const nativeInputs = container.querySelectorAll('input[type="time"]');

    expect(nativeInputs.length).toBe(2);
  });

  it('renders range divider with default divider', () => {
    const { container } = render(<TimeRangePicker />);

    const rangeDivider = container.querySelector('.react-timerange-picker__range-divider');

    expect(rangeDivider).toBeInTheDocument();
    expect(rangeDivider).toHaveTextContent('–');
  });

  it('renders range divider with custom divider', () => {
    const { container } = render(<TimeRangePicker rangeDivider="to" />);

    const rangeDivider = container.querySelector('.react-timerange-picker__range-divider');

    expect(rangeDivider).toBeInTheDocument();
    expect(rangeDivider).toHaveTextContent('to');
  });

  describe('renders clear button properly', () => {
    it('renders clear button', () => {
      const { container } = render(<TimeRangePicker />);

      const clearButton = container.querySelector('button.react-timerange-picker__clear-button');

      expect(clearButton).toBeInTheDocument();
    });

    it('renders clear icon by default when clearIcon is not given', () => {
      const { container } = render(<TimeRangePicker />);

      const clearButton = container.querySelector('button.react-timerange-picker__clear-button');

      const clearIcon = clearButton.querySelector('svg');

      expect(clearIcon).toBeInTheDocument();
    });

    it('renders clear icon when given clearIcon as a React element', () => {
      function ClearIcon() {
        return '❌';
      }

      const { container } = render(<TimeRangePicker clearIcon={<ClearIcon />} />);

      const clearButton = container.querySelector('button.react-timerange-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a function', () => {
      function ClearIcon() {
        return '❌';
      }

      const { container } = render(<TimeRangePicker clearIcon={ClearIcon} />);

      const clearButton = container.querySelector('button.react-timerange-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });
  });

  describe('renders clock button properly', () => {
    it('renders clock button', () => {
      const { container } = render(<TimeRangePicker />);

      const clockButton = container.querySelector('button.react-timerange-picker__clock-button');

      expect(clockButton).toBeInTheDocument();
    });

    it('renders clock icon by default when clockIcon is not given', () => {
      const { container } = render(<TimeRangePicker />);

      const clockButton = container.querySelector('button.react-timerange-picker__clock-button');

      const clockIcon = clockButton.querySelector('svg');

      expect(clockIcon).toBeInTheDocument();
    });

    it('renders clock icon when given clockIcon as a React element', () => {
      function ClockIcon() {
        return '⏰';
      }

      const { container } = render(<TimeRangePicker clockIcon={<ClockIcon />} />);

      const clockButton = container.querySelector('button.react-timerange-picker__clock-button');

      expect(clockButton).toHaveTextContent('⏰');
    });

    it('renders clock icon when given clockIcon as a function', () => {
      function ClockIcon() {
        return '⏰';
      }

      const { container } = render(<TimeRangePicker clockIcon={ClockIcon} />);

      const clockButton = container.querySelector('button.react-timerange-picker__clock-button');

      expect(clockButton).toHaveTextContent('⏰');
    });
  });

  it('renders Clock components when given isOpen flag', () => {
    const { container } = render(<TimeRangePicker isOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not render Clock component when given disableClock & isOpen flags', () => {
    const { container } = render(<TimeRangePicker disableClock isOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();
  });

  it('opens Clock component when given isOpen flag by changing props', () => {
    const { container, rerender } = render(<TimeRangePicker />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();

    rerender(<TimeRangePicker isOpen />);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  it('opens Clock component when clicking on a button', () => {
    const { container } = render(<TimeRangePicker />);

    const clock = container.querySelector('.react-clock');
    const button = container.querySelector('button.react-timerange-picker__clock-button');

    expect(clock).toBeFalsy();

    fireEvent.click(button);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  describe('handles opening Clock component when focusing on an input inside properly', () => {
    it('opens Clock component when focusing on an input inside by default', () => {
      const { container } = render(<TimeRangePicker />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('opens Clock component when focusing on an input inside given openClockOnFocus = true', () => {
      const { container } = render(<TimeRangePicker openClockOnFocus />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('does not open Clock component when focusing on an input inside given openClockOnFocus = false', () => {
      const { container } = render(<TimeRangePicker openClockOnFocus={false} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on a select element', () => {
      const { container } = render(<TimeRangePicker format="hh:mm:ss a" />);

      const clock = container.querySelector('.react-clock');
      const select = container.querySelector('select[name="amPm"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(select);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });
  });

  it('closes Clock component when clicked outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<TimeRangePicker isOpen />, { attachTo: root });

    userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-timerange-picker__clock'),
    );
  });

  it('closes Clock component when focused outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<TimeRangePicker isOpen />, { attachTo: root });

    fireEvent.focusIn(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-timerange-picker__clock'),
    );
  });

  it('closes Clock component when tapped outside', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<TimeRangePicker isOpen />, { attachTo: root });

    fireEvent.touchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-timerange-picker__clock'),
    );
  });

  it('does not close Clock component when clicked inside', () => {
    const { container } = render(<TimeRangePicker isOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[0];
    const minuteInput = customInputs[1];

    fireEvent.blur(hourInput);
    fireEvent.focus(minuteInput);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Clock when calling internal onChange by default', async () => {
    const instance = createRef();

    const { container } = render(<TimeRangePicker isOpen ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date());
    });

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-timerange-picker__clock'),
    );
  });

  it('does not close Clock when calling internal onChange with prop closeClock = false', () => {
    const instance = createRef();

    const { container } = render(<TimeRangePicker closeClock={false} isOpen ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date());
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument(1);
  });

  it('does not close Clock when calling internal onChange with closeClock = false', () => {
    const instance = createRef();

    const { container } = render(<TimeRangePicker isOpen ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(new Date(), false);
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument(1);
  });

  it('calls onChange callback when calling internal onChange', () => {
    const instance = createRef();
    const nextValue = new Date(2019, 0, 1);
    const onChange = vi.fn();

    render(<TimeRangePicker onChange={onChange} ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    act(() => {
      onChangeInternal(nextValue);
    });

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('clears the value when clicking on a button', () => {
    const instance = createRef();
    const onChange = vi.fn();

    const { container } = render(<TimeRangePicker onChange={onChange} ref={instance} />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();

    const button = container.querySelector('button.react-timerange-picker__clear-button');

    fireEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  describe('onChangeFrom', () => {
    it('calls onChange properly given no initial value', () => {
      const instance = createRef();

      render(<TimeRangePicker ref={instance} />);

      const componentInstance = instance.current;
      const { onChangeFrom: onChangeFromInternal } = componentInstance;

      const onChangeSpy = vi.spyOn(componentInstance, 'onChange');

      const nextValueFrom = '16:00:00';

      act(() => {
        onChangeFromInternal(nextValueFrom);
      });

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, undefined], undefined);
    });

    it('calls onChange properly given single initial value', () => {
      const instance = createRef();
      const value = '10:00:00';

      render(<TimeRangePicker value={value} ref={instance} />);

      const componentInstance = instance.current;
      const { onChangeFrom: onChangeFromInternal } = componentInstance;

      const onChangeSpy = vi.spyOn(componentInstance, 'onChange');

      const nextValueFrom = '16:00:00';

      act(() => {
        onChangeFromInternal(nextValueFrom);
      });

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, undefined], undefined);
    });

    it('calls onChange properly given initial value as an array', () => {
      const instance = createRef();
      const valueFrom = '10:00:00';
      const valueTo = '11:00:00';
      const value = [valueFrom, valueTo];

      render(<TimeRangePicker value={value} ref={instance} />);

      const componentInstance = instance.current;
      const { onChangeFrom: onChangeFromInternal } = componentInstance;

      const onChangeSpy = vi.spyOn(componentInstance, 'onChange');

      const nextValueFrom = '16:00:00';

      act(() => {
        onChangeFromInternal(nextValueFrom);
      });

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, valueTo], undefined);
    });
  });

  describe('onChangeTo', () => {
    it('calls onChange properly given no initial value', () => {
      const instance = createRef();

      render(<TimeRangePicker ref={instance} />);

      const componentInstance = instance.current;
      const { onChangeTo: onChangeToInternal } = componentInstance;

      const onChangeSpy = vi.spyOn(componentInstance, 'onChange');

      const nextValueTo = '16:00:00';

      act(() => {
        onChangeToInternal(nextValueTo);
      });

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([undefined, nextValueTo], undefined);
    });

    it('calls onChange properly given single initial value', () => {
      const instance = createRef();
      const value = '10:00:00';

      render(<TimeRangePicker value={value} ref={instance} />);

      const componentInstance = instance.current;
      const { onChangeTo: onChangeToInternal } = componentInstance;

      const onChangeSpy = vi.spyOn(componentInstance, 'onChange');

      const nextValueTo = '16:00:00';

      act(() => {
        onChangeToInternal(nextValueTo);
      });

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([value, nextValueTo], undefined);
    });

    it('calls onChange properly given initial value as an array', () => {
      const instance = createRef();
      const valueFrom = '10:00:00';
      const valueTo = '11:00:00';
      const value = [valueFrom, valueTo];

      render(<TimeRangePicker value={value} ref={instance} />);

      const componentInstance = instance.current;
      const { onChangeTo: onChangeToInternal } = componentInstance;

      const onChangeSpy = vi.spyOn(componentInstance, 'onChange');

      const nextValueTo = '16:00:00';

      act(() => {
        onChangeToInternal(nextValueTo);
      });

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([valueFrom, nextValueTo], undefined);
    });
  });
});
