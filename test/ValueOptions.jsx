import React from 'react';
import PropTypes from 'prop-types';

export default function ValueOptions({ setValue, value }) {
  const startTime = [].concat(value)[0];
  const endTime = [].concat(value)[1];

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
    <fieldset>
      <legend>Set time externally</legend>

      <div>
        <label htmlFor="startTime">Start time</label>
        <input id="startTime" onChange={onStartChange} type="time" value={startTime || ''} />
        &nbsp;
        <button onClick={() => setStartValue(null)} type="button">
          Clear to null
        </button>
        <button onClick={() => setStartValue('')} type="button">
          Clear to empty string
        </button>
      </div>

      <div>
        <label htmlFor="endTime">End time</label>
        <input id="endTime" onChange={onEndChange} type="time" value={endTime || ''} />
        &nbsp;
        <button onClick={() => setEndValue(null)} type="button">
          Clear to null
        </button>
        <button onClick={() => setEndValue('')} type="button">
          Clear to empty string
        </button>
      </div>
    </fieldset>
  );
}

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

const isValueOrValueArray = PropTypes.oneOfType([isValue, PropTypes.arrayOf(isValue)]);

ValueOptions.propTypes = {
  setValue: PropTypes.func.isRequired,
  value: isValueOrValueArray,
};
