import React from 'react';
import { mount } from 'enzyme';

import TimeRangePicker from './TimeRangePicker';

/* eslint-disable comma-dangle */

describe('TimeRangePicker', () => {
  it('passes default name to TimeInput components', () => {
    const component = mount(
      <TimeRangePicker />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.at(0).prop('name')).toBe('timerange_from');
    expect(timeInput.at(1).prop('name')).toBe('timerange_to');
  });

  it('passes custom name to TimeInput components', () => {
    const name = 'testName';

    const component = mount(
      <TimeRangePicker name={name} />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.at(0).prop('name')).toBe(`${name}_from`);
    expect(timeInput.at(1).prop('name')).toBe(`${name}_to`);
  });

  it('passes disabled flag to TimeInput components', () => {
    const component = mount(
      <TimeRangePicker disabled />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.at(0).prop('disabled')).toBeTruthy();
    expect(timeInput.at(1).prop('disabled')).toBeTruthy();
  });

  it('passes format to TimeInput components', () => {
    const format = 'H:mm:ss';

    const component = mount(
      <TimeRangePicker format={format} />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.at(0).prop('format')).toBe(format);
    expect(timeInput.at(1).prop('format')).toBe(format);
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

    const component = mount(
      <TimeRangePicker {...ariaLabelProps} />
    );

    const clockButton = component.find('button.react-timerange-picker__clock-button');
    const clearButton = component.find('button.react-timerange-picker__clear-button');
    const timeInput = component.find('TimeInput');

    expect(clockButton.prop('aria-label')).toBe(ariaLabelProps.clockAriaLabel);
    expect(clearButton.prop('aria-label')).toBe(ariaLabelProps.clearAriaLabel);
    expect(timeInput.at(0).prop('amPmAriaLabel')).toBe(ariaLabelProps.amPmAriaLabel);
    expect(timeInput.at(0).prop('hourAriaLabel')).toBe(ariaLabelProps.hourAriaLabel);
    expect(timeInput.at(0).prop('minuteAriaLabel')).toBe(ariaLabelProps.minuteAriaLabel);
    expect(timeInput.at(0).prop('nativeInputAriaLabel')).toBe(ariaLabelProps.nativeInputAriaLabel);
    expect(timeInput.at(0).prop('secondAriaLabel')).toBe(ariaLabelProps.secondAriaLabel);
    expect(timeInput.at(1).prop('amPmAriaLabel')).toBe(ariaLabelProps.amPmAriaLabel);
    expect(timeInput.at(1).prop('hourAriaLabel')).toBe(ariaLabelProps.hourAriaLabel);
    expect(timeInput.at(1).prop('minuteAriaLabel')).toBe(ariaLabelProps.minuteAriaLabel);
    expect(timeInput.at(1).prop('nativeInputAriaLabel')).toBe(ariaLabelProps.nativeInputAriaLabel);
    expect(timeInput.at(1).prop('secondAriaLabel')).toBe(ariaLabelProps.secondAriaLabel);
  });

  it('passes placeholder props to TimeInput components', () => {
    const placeholderProps = {
      hourPlaceholder: 'hh',
      minutePlaceholder: 'mm',
      secondPlaceholder: 'ss',
    };

    const component = mount(
      <TimeRangePicker {...placeholderProps} />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.at(0).prop('hourPlaceholder')).toBe(placeholderProps.hourPlaceholder);
    expect(timeInput.at(0).prop('minutePlaceholder')).toBe(placeholderProps.minutePlaceholder);
    expect(timeInput.at(0).prop('secondPlaceholder')).toBe(placeholderProps.secondPlaceholder);
    expect(timeInput.at(1).prop('hourPlaceholder')).toBe(placeholderProps.hourPlaceholder);
    expect(timeInput.at(1).prop('minutePlaceholder')).toBe(placeholderProps.minutePlaceholder);
    expect(timeInput.at(1).prop('secondPlaceholder')).toBe(placeholderProps.secondPlaceholder);
  });

  describe('passes value to TimeInput components', () => {
    it('passes single value to TimeInput components', () => {
      const value = new Date(2019, 0, 1);

      const component = mount(
        <TimeRangePicker value={value} />
      );

      const timeInput = component.find('TimeInput');

      expect(timeInput.at(0).prop('value')).toBe(value);
      expect(timeInput.at(1).prop('value')).toBe(undefined);
    });

    it('passes the first item of an array of values to TimeInput components', () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const component = mount(
        <TimeRangePicker value={[value1, value2]} />
      );

      const timeInput = component.find('TimeInput');

      expect(timeInput.at(0).prop('value')).toBe(value1);
      expect(timeInput.at(1).prop('value')).toBe(value2);
    });
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const component = mount(
      <TimeRangePicker className={className} />
    );

    const wrapperClassName = component.prop('className');

    expect(wrapperClassName.includes(className)).toBe(true);
  });

  it('applies clockClassName to the clock when given a string', () => {
    const clockClassName = 'testClassName';

    const component = mount(
      <TimeRangePicker
        clockClassName={clockClassName}
        isOpen
      />
    );

    const clock = component.find('Clock');
    const clockWrapperClassName = clock.prop('className');

    expect(clockWrapperClassName.includes(clockClassName)).toBe(true);
  });

  it('renders TimeInput components', () => {
    const component = mount(
      <TimeRangePicker />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput).toHaveLength(2);
  });

  it('renders range divider', () => {
    const component = mount(
      <TimeRangePicker />
    );

    const rangeDivider = component.find('.react-timerange-picker__range-divider');

    expect(rangeDivider).toHaveLength(1);
  });

  it('renders clear button', () => {
    const component = mount(
      <TimeRangePicker />
    );

    const clearButton = component.find('button.react-timerange-picker__clear-button');

    expect(clearButton).toHaveLength(1);
  });

  it('renders clock button', () => {
    const component = mount(
      <TimeRangePicker />
    );

    const clockButton = component.find('button.react-timerange-picker__clock-button');

    expect(clockButton).toHaveLength(1);
  });

  it('renders TimeInput and Clock components when given isOpen flag', () => {
    const component = mount(
      <TimeRangePicker isOpen />
    );

    const timeInput = component.find('TimeInput');
    const clock = component.find('Clock');

    expect(timeInput).toHaveLength(2);
    expect(clock).toHaveLength(1);
  });

  it('does not render Clock component when given disableClock & isOpen flags', () => {
    const component = mount(
      <TimeRangePicker disableClock isOpen />
    );

    const timeInput = component.find('TimeInput');
    const clock = component.find('Clock');

    expect(timeInput).toHaveLength(2);
    expect(clock).toHaveLength(0);
  });

  it('opens Clock component when given isOpen flag by changing props', () => {
    const component = mount(
      <TimeRangePicker />
    );

    const clock = component.find('Clock');

    expect(clock).toHaveLength(0);

    component.setProps({ isOpen: true });
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('opens Clock component when clicking on a button', () => {
    const component = mount(
      <TimeRangePicker />
    );

    const clock = component.find('Clock');
    const button = component.find('button.react-timerange-picker__clock-button');

    expect(clock).toHaveLength(0);

    button.simulate('click');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('opens Clock component when focusing on an input inside', () => {
    const component = mount(
      <TimeRangePicker />
    );

    const clock = component.find('Clock');
    const input = component.find('input[name^="hour"]').first();

    expect(clock).toHaveLength(0);

    input.simulate('focus');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('closes Clock component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <TimeRangePicker isOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('closes Clock component when focused outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <TimeRangePicker isOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('FocusEvent');
    event.initEvent('focusin', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('closes Calendar component when tapped outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <TimeRangePicker isOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('TouchEvent');
    event.initEvent('touchstart', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('does not close Clock component when clicked inside', () => {
    const component = mount(
      <TimeRangePicker isOpen />
    );

    const customInputs = component.find('input[type="number"]');
    const hourInput = customInputs.at(0);
    const minuteInput = customInputs.at(1);

    hourInput.simulate('blur');
    minuteInput.simulate('focus');
    component.update();

    expect(component.state('isOpen')).toBe(true);
  });

  it('clears the value when clicking on a button', () => {
    const onChange = jest.fn();

    const component = mount(
      <TimeRangePicker onChange={onChange} />
    );

    const calendar = component.find('Calendar');
    const button = component.find('button.react-timerange-picker__clear-button');

    expect(calendar).toHaveLength(0);

    button.simulate('click');
    component.update();

    expect(onChange).toHaveBeenCalledWith(null);
  });

  describe('onChangeFrom', () => {
    it('calls onChange properly given no initial value', () => {
      const component = mount(
        <TimeRangePicker />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueFrom = new Date();
      componentInstance.onChangeFrom(nextValueFrom);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, undefined], true);
    });

    it('calls onChange properly given single initial value', () => {
      const value = '10:00:00';

      const component = mount(
        <TimeRangePicker value={value} />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueFrom = new Date();
      componentInstance.onChangeFrom(nextValueFrom);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, undefined], true);
    });

    it('calls onChange properly given initial value as an array', () => {
      const valueFrom = '10:00:00';
      const valueTo = '11:00:00';
      const value = [valueFrom, valueTo];

      const component = mount(
        <TimeRangePicker value={value} />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueFrom = '16:00:00';
      componentInstance.onChangeFrom(nextValueFrom);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([nextValueFrom, valueTo], true);
    });
  });

  describe('onChangeTo', () => {
    it('calls onChange properly given no initial value', () => {
      const component = mount(
        <TimeRangePicker />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueTo = '16:00:00';
      componentInstance.onChangeTo(nextValueTo);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([undefined, nextValueTo], true);
    });

    it('calls onChange properly given single initial value', () => {
      const value = '10:00:00';

      const component = mount(
        <TimeRangePicker value={value} />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueTo = '16:00:00';
      componentInstance.onChangeTo(nextValueTo);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([value, nextValueTo], true);
    });

    it('calls onChange properly given initial value as an array', () => {
      const valueFrom = '10:00:00';
      const valueTo = '11:00:00';
      const value = [valueFrom, valueTo];

      const component = mount(
        <TimeRangePicker value={value} />
      );

      const componentInstance = component.instance();

      const onChangeSpy = jest.spyOn(componentInstance, 'onChange');

      const nextValueTo = '16:00:00';
      componentInstance.onChangeTo(nextValueTo);

      expect(onChangeSpy).toHaveBeenCalled();
      expect(onChangeSpy).toHaveBeenCalledWith([valueFrom, nextValueTo], true);
    });
  });
});
