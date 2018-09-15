import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class ValueOptions extends PureComponent {
  get startTime() {
    const { value } = this.props;

    return [].concat(value)[0];
  }

  get endTime() {
    const { value } = this.props;

    return [].concat(value)[1];
  }

  setValue = (value) => {
    const { setState } = this.props;

    setState({ value });
  }

  setStartValue = (startValue) => {
    const { value } = this.props;

    if (!startValue) {
      this.setValue(value[1] || startValue);
      return;
    }

    if (Array.isArray(value)) {
      this.setValue([startValue, value[1]]);
    } else {
      this.setValue(startValue);
    }
  }

  setEndValue = (endValue) => {
    const { value } = this.props;

    if (!endValue) {
      this.setValue(value[0]);
      return;
    }

    if (Array.isArray(value)) {
      this.setValue([value[0], endValue]);
    } else {
      this.setValue([value, endValue]);
    }
  }

  onStartChange = (event) => {
    const { value } = event.target;
    this.setStartValue(value);
  }

  onEndChange = (event) => {
    const { value } = event.target;
    this.setEndValue(value);
  }

  render() {
    return (
      <fieldset id="valueOptions">
        <legend htmlFor="valueOptions">
          Set time externally
        </legend>

        <div>
          <label htmlFor="startTime">
            Start time
          </label>
          <input
            id="startTime"
            onChange={this.onStartChange}
            type="time"
            value={this.startTime || ''}
          />
          &nbsp;
          <button
            type="button"
            onClick={() => this.setStartValue(null)}
          >
            Clear to null
          </button>
          <button
            type="button"
            onClick={() => this.setStartValue('')}
          >
            Clear to empty string
          </button>
        </div>

        <div>
          <label htmlFor="endTime">
            End time
          </label>
          <input
            id="endTime"
            onChange={this.onEndChange}
            type="time"
            value={this.endTime || ''}
          />
          &nbsp;
          <button
            type="button"
            onClick={() => this.setEndValue(null)}
          >
            Clear to null
          </button>
          <button
            type="button"
            onClick={() => this.setEndValue('')}
          >
            Clear to empty string
          </button>
        </div>
      </fieldset>
    );
  }
}

ValueOptions.propTypes = {
  setState: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),
};
