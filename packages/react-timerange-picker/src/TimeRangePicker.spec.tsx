import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { act, fireEvent } from '@testing-library/react';

import TimeRangePicker from './TimeRangePicker.js';

async function waitForElementToBeRemovedOrHidden(callback: () => HTMLElement | null) {
  const element = callback();

  if (element) {
    await vi.waitFor(() =>
      expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
    );
  }
}

describe('TimeRangePicker', () => {
  it('passes default name to TimeInput components', async () => {
    const { container } = await render(<TimeRangePicker />);

    const nativeInputs = container.querySelectorAll('input[type="time"]');

    expect(nativeInputs[0]).toHaveAttribute('name', 'timerange_from');
    expect(nativeInputs[1]).toHaveAttribute('name', 'timerange_to');
  });

  it('passes custom name to TimeInput components', async () => {
    const name = 'testName';

    const { container } = await render(<TimeRangePicker name={name} />);

    const nativeInputs = container.querySelectorAll('input[type="time"]');

    expect(nativeInputs[0]).toHaveAttribute('name', `${name}_from`);
    expect(nativeInputs[1]).toHaveAttribute('name', `${name}_to`);
  });

  it('passes autoFocus flag to first TimeInput component', async () => {
    const { container } = await render(<TimeRangePicker autoFocus />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveFocus();
  });

  it('passes disabled flag to TimeInput components', async () => {
    const { container } = await render(<TimeRangePicker disabled />);

    const nativeInputs = container.querySelectorAll('input[type="time"]');

    expect(nativeInputs[0]).toBeDisabled();
    expect(nativeInputs[1]).toBeDisabled();
  });

  it('passes format to TimeInput components', async () => {
    const { container } = await render(<TimeRangePicker format="ss" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs).toHaveLength(2);
    expect(customInputs[0]).toHaveAttribute('name', 'second');
    expect(customInputs[1]).toHaveAttribute('name', 'second');
  });

  it('passes aria-label props to TimeInput components', async () => {
    const ariaLabelProps = {
      amPmAriaLabel: 'Select AM/PM',
      clearAriaLabel: 'Clear value',
      clockAriaLabel: 'Toggle clock',
      hourAriaLabel: 'Hour',
      minuteAriaLabel: 'Minute',
      nativeInputAriaLabel: 'Time',
      secondAriaLabel: 'Second',
    };

    const { container } = await render(<TimeRangePicker {...ariaLabelProps} maxDetail="second" />);

    const clockButton = container.querySelector('button.react-timerange-picker__clock-button');
    const clearButton = container.querySelector('button.react-timerange-picker__clear-button');
    const timeInputs = container.querySelectorAll(
      '.react-timerange-picker__inputGroup',
    ) as unknown as [HTMLDivElement, HTMLDivElement];

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

  it('passes placeholder props to TimeInput components', async () => {
    const placeholderProps = {
      hourPlaceholder: 'hh',
      minutePlaceholder: 'mm',
      secondPlaceholder: 'ss',
    };

    const { container } = await render(
      <TimeRangePicker {...placeholderProps} maxDetail="second" />,
    );

    const timeInputs = container.querySelectorAll(
      '.react-timerange-picker__inputGroup',
    ) as unknown as [HTMLDivElement, HTMLDivElement];

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
    it('passes single value to TimeInput components', async () => {
      const value = new Date(2019, 0, 1);

      const { container } = await render(<TimeRangePicker value={value} />);

      const nativeInputs = container.querySelectorAll('input[type="time"]');

      expect(nativeInputs[0]).toHaveValue('00:00');
      expect(nativeInputs[1]).toHaveValue('');
    });

    it('passes the first item of an array of values to TimeInput components', async () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1, 12, 30);

      const { container } = await render(<TimeRangePicker value={[value1, value2]} />);

      const nativeInputs = container.querySelectorAll('input[type="time"]');

      expect(nativeInputs[0]).toHaveValue('00:00');
      expect(nativeInputs[1]).toHaveValue('12:30');
    });
  });

  it('applies className to its wrapper when given a string', async () => {
    const className = 'testClassName';

    const { container } = await render(<TimeRangePicker className={className} />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isOpen flag', async () => {
    const { container } = await render(<TimeRangePicker isOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-timerange-picker--open');
  });

  it('applies clock className to the clock when given a string', async () => {
    const clockClassName = 'testClassName';

    const { container } = await render(
      <TimeRangePicker clockProps={{ className: clockClassName }} isOpen />,
    );

    const clock = container.querySelector('.react-clock');

    expect(clock).toHaveClass(clockClassName);
  });

  it('renders TimeInput components', async () => {
    const { container } = await render(<TimeRangePicker />);

    const nativeInputs = container.querySelectorAll('input[type="time"]');

    expect(nativeInputs.length).toBe(2);
  });

  it('renders range divider with default divider', async () => {
    const { container } = await render(<TimeRangePicker />);

    const rangeDivider = container.querySelector('.react-timerange-picker__range-divider');

    expect(rangeDivider).toBeInTheDocument();
    expect(rangeDivider).toHaveTextContent('–');
  });

  it('renders range divider with custom divider', async () => {
    const { container } = await render(<TimeRangePicker rangeDivider="to" />);

    const rangeDivider = container.querySelector('.react-timerange-picker__range-divider');

    expect(rangeDivider).toBeInTheDocument();
    expect(rangeDivider).toHaveTextContent('to');
  });

  describe('renders clear button properly', () => {
    it('renders clear button', async () => {
      const { container } = await render(<TimeRangePicker />);

      const clearButton = container.querySelector('button.react-timerange-picker__clear-button');

      expect(clearButton).toBeInTheDocument();
    });

    it('renders clear icon by default when clearIcon is not given', async () => {
      const { container } = await render(<TimeRangePicker />);

      const clearButton = container.querySelector(
        'button.react-timerange-picker__clear-button',
      ) as HTMLButtonElement;

      const clearIcon = clearButton.querySelector('svg');

      expect(clearIcon).toBeInTheDocument();
    });

    it('renders clear icon when given clearIcon as a string', async () => {
      const { container } = await render(<TimeRangePicker clearIcon="❌" />);

      const clearButton = container.querySelector('button.react-timerange-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a React element', async () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = await render(<TimeRangePicker clearIcon={<ClearIcon />} />);

      const clearButton = container.querySelector('button.react-timerange-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a function', async () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = await render(<TimeRangePicker clearIcon={ClearIcon} />);

      const clearButton = container.querySelector('button.react-timerange-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });
  });

  describe('renders clock button properly', () => {
    it('renders clock button', async () => {
      const { container } = await render(<TimeRangePicker />);

      const clockButton = container.querySelector('button.react-timerange-picker__clock-button');

      expect(clockButton).toBeInTheDocument();
    });

    it('renders clock icon by default when clockIcon is not given', async () => {
      const { container } = await render(<TimeRangePicker />);

      const clockButton = container.querySelector(
        'button.react-timerange-picker__clock-button',
      ) as HTMLButtonElement;

      const clockIcon = clockButton.querySelector('svg');

      expect(clockIcon).toBeInTheDocument();
    });

    it('renders clock icon when given clockIcon as a string', async () => {
      const { container } = await render(<TimeRangePicker clockIcon="🕒" />);

      const clockButton = container.querySelector('button.react-timerange-picker__clock-button');

      expect(clockButton).toHaveTextContent('🕒');
    });

    it('renders clock icon when given clockIcon as a React element', async () => {
      function ClockIcon() {
        return <>🕒</>;
      }

      const { container } = await render(<TimeRangePicker clockIcon={<ClockIcon />} />);

      const clockButton = container.querySelector('button.react-timerange-picker__clock-button');

      expect(clockButton).toHaveTextContent('🕒');
    });

    it('renders clock icon when given clockIcon as a function', async () => {
      function ClockIcon() {
        return <>🕒</>;
      }

      const { container } = await render(<TimeRangePicker clockIcon={ClockIcon} />);

      const clockButton = container.querySelector('button.react-timerange-picker__clock-button');

      expect(clockButton).toHaveTextContent('🕒');
    });
  });

  it('renders Clock components when given isOpen flag', async () => {
    const { container } = await render(<TimeRangePicker isOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not render Clock component when given disableClock & isOpen flags', async () => {
    const { container } = await render(<TimeRangePicker disableClock isOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();
  });

  it('opens Clock component when given isOpen flag by changing props', async () => {
    const { container, rerender } = await render(<TimeRangePicker />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();

    rerender(<TimeRangePicker isOpen />);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  it('opens Clock component when clicking on a button', async () => {
    const { container } = await render(<TimeRangePicker />);

    const clock = container.querySelector('.react-clock');
    const button = container.querySelector(
      'button.react-timerange-picker__clock-button',
    ) as HTMLButtonElement;

    expect(clock).toBeFalsy();

    await userEvent.click(button);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  function triggerFocusInEvent(element: HTMLElement) {
    element.dispatchEvent(
      new FocusEvent('focusin', { bubbles: true, cancelable: false, composed: true }),
    );
  }

  function triggerFocusEvent(element: HTMLElement) {
    triggerFocusInEvent(element);

    element.dispatchEvent(
      new FocusEvent('focus', { bubbles: false, cancelable: false, composed: true }),
    );
  }

  describe('handles opening Clock component when focusing on an input inside properly', () => {
    it('opens Clock component when focusing on an input inside by default', async () => {
      const { container } = await render(<TimeRangePicker />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('opens Clock component when focusing on an input inside given openClockOnFocus = true', async () => {
      const { container } = await render(<TimeRangePicker openClockOnFocus />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('does not open Clock component when focusing on an input inside given openClockOnFocus = false', async () => {
      const { container } = await render(<TimeRangePicker openClockOnFocus={false} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock when focusing on an input inside given shouldOpenCalendar function returning false', async () => {
      const shouldOpenClock = () => false;

      const { container } = await render(<TimeRangePicker shouldOpenClock={shouldOpenClock} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      triggerFocusEvent(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on a select element', async () => {
      const { container } = await render(<TimeRangePicker format="hh:mm:ss a" />);

      const clock = container.querySelector('.react-clock');
      const select = container.querySelector('select[name="amPm"]') as HTMLSelectElement;

      expect(clock).toBeFalsy();

      triggerFocusEvent(select);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });
  });

  it('closes Clock component when clicked outside', async () => {
    const { container } = await render(<TimeRangePicker isOpen />);

    await userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-timerange-picker__clock'),
    );
  });

  it('does not close Clock clicked outside with shouldCloseClock function returning false', async () => {
    const shouldCloseClock = () => false;

    const { container } = await render(
      <TimeRangePicker isOpen shouldCloseClock={shouldCloseClock} />,
    );

    await userEvent.click(document.body);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Clock component when focused outside', async () => {
    const { container } = await render(<TimeRangePicker isOpen />);

    triggerFocusInEvent(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-timerange-picker__clock'),
    );
  });

  function triggerTouchStart(element: HTMLElement) {
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
  }

  it('closes Clock component when tapped outside', async () => {
    const { container } = await render(<TimeRangePicker isOpen />);

    triggerTouchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-timerange-picker__clock'),
    );
  });

  it('does not close Clock component when clicked inside', async () => {
    const { container } = await render(<TimeRangePicker isOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[0] as HTMLInputElement;
    const minuteInput = customInputs[1] as HTMLInputElement;

    fireEvent.blur(hourInput);
    triggerFocusEvent(minuteInput);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not close Clock when changing value', async () => {
    const { container } = await render(<TimeRangePicker isOpen />);

    const hourInput = container.querySelector('input[name="hour12"]') as HTMLInputElement;

    await act(async () => {
      await userEvent.fill(hourInput, '9');
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('calls onChange callback when changing value', async () => {
    const value = '22:41:28';
    const onChange = vi.fn();

    const { container } = await render(
      <TimeRangePicker maxDetail="second" onChange={onChange} value={value} />,
    );

    const hourInput = container.querySelector('input[name="hour12"]') as HTMLInputElement;

    await act(async () => {
      await userEvent.fill(hourInput, '9');
    });

    expect(onChange).toHaveBeenCalledWith(['21:41:28', null]);
  });

  it('calls onInvalidChange callback when changing value to an invalid one', async () => {
    const value = '22:41:28';
    const onInvalidChange = vi.fn();

    const { container } = await render(
      <TimeRangePicker maxDetail="second" onInvalidChange={onInvalidChange} value={value} />,
    );

    const hourInput = container.querySelector('input[name="hour12"]') as HTMLInputElement;

    await act(async () => {
      await userEvent.fill(hourInput, '99');
    });

    expect(onInvalidChange).toHaveBeenCalled();
  });

  it('clears the value when clicking on a button', async () => {
    const onChange = vi.fn();

    const { container } = await render(<TimeRangePicker onChange={onChange} />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();

    const button = container.querySelector(
      'button.react-timerange-picker__clear-button',
    ) as HTMLButtonElement;

    await userEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  describe('onChangeFrom', () => {
    it('calls onChange properly given no initial value', async () => {
      const onChange = vi.fn();

      const { container } = await render(
        <TimeRangePicker format="H:m:s" maxDetail="second" onChange={onChange} />,
      );

      const nextValueFrom = '16:00:00';

      const customInputs = container.querySelectorAll('input[data-input]');
      const hourInput = customInputs[0] as HTMLInputElement;
      const minuteInput = customInputs[1] as HTMLInputElement;
      const secondInput = customInputs[2] as HTMLInputElement;

      await act(async () => {
        await userEvent.fill(hourInput, '16');

        await userEvent.fill(minuteInput, '0');

        await userEvent.fill(secondInput, '0');
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([nextValueFrom, null]);
    });

    it('calls onChange properly given single initial value', async () => {
      const onChange = vi.fn();
      const value = '10:00:00';

      const { container } = await render(
        <TimeRangePicker format="H:m:s" maxDetail="second" onChange={onChange} value={value} />,
      );

      const nextValueFrom = '16:00:00';

      const customInputs = container.querySelectorAll('input[data-input]');
      const hourInput = customInputs[0] as HTMLInputElement;
      const minuteInput = customInputs[1] as HTMLInputElement;
      const secondInput = customInputs[2] as HTMLInputElement;

      await act(async () => {
        await userEvent.fill(hourInput, '16');

        await userEvent.fill(minuteInput, '0');

        await userEvent.fill(secondInput, '0');
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([nextValueFrom, null]);
    });

    it('calls onChange properly given initial value as an array', async () => {
      const onChange = vi.fn();
      const valueFrom = '10:00:00';
      const valueTo = '16:00:00';
      const value = [valueFrom, valueTo] as [string, string];

      const { container } = await render(
        <TimeRangePicker format="H:m:s" maxDetail="second" onChange={onChange} value={value} />,
      );

      const nextValueFrom = '13:00:00';

      const customInputs = container.querySelectorAll('input[data-input]');
      const hourInput = customInputs[0] as HTMLInputElement;
      const minuteInput = customInputs[1] as HTMLInputElement;
      const secondInput = customInputs[2] as HTMLInputElement;

      await act(async () => {
        await userEvent.fill(hourInput, '13');

        await userEvent.fill(minuteInput, '0');

        await userEvent.fill(secondInput, '0');
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([nextValueFrom, valueTo]);
    });
  });

  describe('onChangeTo', () => {
    it('calls onChange properly given no initial value', async () => {
      const onChange = vi.fn();

      const { container } = await render(
        <TimeRangePicker format="H:m:s" maxDetail="second" onChange={onChange} />,
      );

      const nextValueTo = '16:00:00';

      const customInputs = container.querySelectorAll('input[data-input]');
      const hourInput = customInputs[3] as HTMLInputElement;
      const minuteInput = customInputs[4] as HTMLInputElement;
      const secondInput = customInputs[5] as HTMLInputElement;

      await act(async () => {
        await userEvent.fill(hourInput, '16');

        await userEvent.fill(minuteInput, '0');

        await userEvent.fill(secondInput, '0');
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([null, nextValueTo]);
    });

    it('calls onChange properly given single initial value', async () => {
      const onChange = vi.fn();
      const value = '10:00:00';

      const { container } = await render(
        <TimeRangePicker format="H:m:s" maxDetail="second" onChange={onChange} value={value} />,
      );

      const nextValueTo = '16:00:00';

      const customInputs = container.querySelectorAll('input[data-input]');
      const hourInput = customInputs[3] as HTMLInputElement;
      const minuteInput = customInputs[4] as HTMLInputElement;
      const secondInput = customInputs[5] as HTMLInputElement;

      await act(async () => {
        await userEvent.fill(hourInput, '16');

        await userEvent.fill(minuteInput, '0');

        await userEvent.fill(secondInput, '0');
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([value, nextValueTo]);
    });

    it('calls onChange properly given initial value as an array', async () => {
      const onChange = vi.fn();
      const valueFrom = '10:00:00';
      const valueTo = '16:00:00';
      const value = [valueFrom, valueTo] as [string, string];

      const { container } = await render(
        <TimeRangePicker format="H:m:s" maxDetail="second" onChange={onChange} value={value} />,
      );

      const nextValueTo = '13:00:00';

      const customInputs = container.querySelectorAll('input[data-input]');
      const hourInput = customInputs[3] as HTMLInputElement;
      const minuteInput = customInputs[4] as HTMLInputElement;
      const secondInput = customInputs[5] as HTMLInputElement;

      await act(async () => {
        await userEvent.fill(hourInput, '13');
      });

      await act(async () => {
        await userEvent.fill(minuteInput, '0');
      });

      await act(async () => {
        await userEvent.fill(secondInput, '0');
      });

      expect(onChange).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith([valueFrom, nextValueTo]);
    });
  });
  it('calls onClick callback when clicked a page (sample of mouse events family)', async () => {
    const onClick = vi.fn();

    const { container } = await render(<TimeRangePicker onClick={onClick} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    await userEvent.click(wrapper);

    expect(onClick).toHaveBeenCalled();
  });

  it('calls onTouchStart callback when touched a page (sample of touch events family)', async () => {
    const onTouchStart = vi.fn();

    const { container } = await render(<TimeRangePicker onTouchStart={onTouchStart} />);

    const wrapper = container.firstElementChild as HTMLDivElement;

    triggerTouchStart(wrapper);

    expect(onTouchStart).toHaveBeenCalled();
  });
});
