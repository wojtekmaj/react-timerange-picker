import React from 'react';
import PropTypes from 'prop-types';

export default function ValueOptions({
  setState,
  value,
}) {
  const startTime = [].concat(value)[0];
  const endTime = [].concat(value)[1];

  function setValue(nextValue) {
    setState({ value: nextValue });
  }

  function setStartValue(startValue) {
    if (!startValue) {
      setValue(value[1] || startValue);
      return;
    }

    if (Array.isArray(value)) {
      setValue([startValue, value[1]]);
    } else {
      setValue(startValue);
    }
  }

  function setEndValue(endValue) {
    if (!endValue) {
      setValue(value[0]);
      return;
    }

    if (Array.isArray(value)) {
      setValue([value[0], endValue]);
    } else {
      setValue([value, endValue]);
    }
  }

  function onStartChange(event) {
    const { value: nextValue } = event.target;
    setStartValue(nextValue);
  }

  function onEndChange(event) {
    const { value: nextValue } = event.target;
    setEndValue(nextValue);
  }

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
          onChange={onStartChange}
          type="time"
          value={startTime || ''}
        />
        &nbsp;
        <button
          type="button"
          onClick={() => setStartValue(null)}
        >
          Clear to null
        </button>
        <button
          type="button"
          onClick={() => setStartValue('')}
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
          onChange={onEndChange}
          type="time"
          value={endTime || ''}
        />
        &nbsp;
        <button
          type="button"
          onClick={() => setEndValue(null)}
        >
          Clear to null
        </button>
        <button
          type="button"
          onClick={() => setEndValue('')}
        >
          Clear to empty string
        </button>
      </div>
    </fieldset>
  );
}

ValueOptions.propTypes = {
  setState: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ])),
  ]),
};
