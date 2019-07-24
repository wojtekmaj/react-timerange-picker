import React, { PureComponent } from 'react';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker/src/entry.nostyle';
import '@wojtekmaj/react-timerange-picker/src/TimeRangePicker.less';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-clock/dist/Clock.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getHoursMinutesSeconds } from 'react-time-picker/dist/shared/dates';

import ValidityOptions from './ValidityOptions';
import MaxDetailOptions from './MaxDetailOptions';
import LocaleOptions from './LocaleOptions';
import ValueOptions from './ValueOptions';
import ViewOptions from './ViewOptions';

import './Test.less';

const now = new Date();

const ariaLabelProps = {
  amPmAriaLabel: 'Select AM/PM',
  clearAriaLabel: 'Clear value',
  clockAriaLabel: 'Toggle clock',
  hourAriaLabel: 'Hour',
  minuteAriaLabel: 'Minute',
  nativeInputAriaLabel: 'Time',
  secondAriaLabel: 'Second',
};

const placeholderProps = {
  hourPlaceholder: 'hh',
  minutePlaceholder: 'mm',
  secondPlaceholder: 'ss',
};

/* eslint-disable no-console */

export default class Test extends PureComponent {
  state = {
    disabled: false,
    locale: null,
    maxTime: null,
    maxDetail: 'minute',
    minTime: null,
    required: true,
    value: getHoursMinutesSeconds(now),
  }

  onChange = value => this.setState({ value })

  render() {
    const {
      disabled,
      locale,
      maxTime,
      maxDetail,
      minTime,
      required,
      value,
    } = this.state;

    const setState = state => this.setState(state);

    return (
      <div className="Test">
        <header>
          <h1>
            react-timerange-picker test page
          </h1>
        </header>
        <div className="Test__container">
          <aside className="Test__container__options">
            <MaxDetailOptions
              maxDetail={maxDetail}
              setState={setState}
            />
            <ValidityOptions
              maxTime={maxTime}
              minTime={minTime}
              required={required}
              setState={setState}
            />
            <LocaleOptions
              setState={setState}
              locale={locale}
            />
            <ValueOptions
              setState={setState}
              value={value}
            />
            <ViewOptions
              disabled={disabled}
              setState={setState}
            />
          </aside>
          <main className="Test__container__content">
            <form
              onSubmit={(event) => {
                event.preventDefault();

                console.warn('TimeRangePicker triggered submitting the form.');
                console.log(event);
              }}
            >
              <TimeRangePicker
                {...ariaLabelProps}
                {...placeholderProps}
                className="myCustomTimeRangePickerClassName"
                clockClassName="myCustomClockClassName"
                disabled={disabled}
                locale={locale}
                maxDetail={maxDetail}
                maxTime={maxTime}
                minTime={minTime}
                name="myCustomName"
                onChange={this.onChange}
                onClockOpen={() => console.log('Clock opened')}
                onClockClose={() => console.log('Clock closed')}
                required={required}
                value={value}
              />
              <br />
              <br />
              <button
                type="submit"
                id="submit"
              >
                Submit
              </button>
            </form>
          </main>
        </div>
      </div>
    );
  }
}
