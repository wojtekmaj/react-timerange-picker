import { getHoursMinutesSeconds } from '@wojtekmaj/date-utils';

import type { LooseValue } from './shared/types.js';

type ValueOptionsProps = {
  setValue: (value: LooseValue) => void;
  value?: LooseValue;
};

export default function ValueOptions({ setValue, value }: ValueOptionsProps) {
  const [startTime, endTime] = Array.isArray(value) ? value : [value, null];

  function setStartValue(nextStartTime: string | null) {
    if (!nextStartTime) {
      setValue(endTime);
      return;
    }

    if (Array.isArray(value)) {
      setValue([nextStartTime, endTime]);
    } else {
      setValue(nextStartTime);
    }
  }

  function setEndValue(nextEndTime: string | null) {
    if (!nextEndTime) {
      setValue(startTime || null);
      return;
    }

    setValue([startTime || null, nextEndTime]);
  }

  function onStartChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value: nextValue } = event.target;

    setStartValue(nextValue);
  }

  function onEndChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value: nextValue } = event.target;

    setEndValue(nextValue);
  }

  return (
    <fieldset>
      <legend>Set time externally</legend>

      <div>
        <label htmlFor="startTime">Start time</label>
        <input
          id="startTime"
          onChange={onStartChange}
          type="time"
          value={
            startTime && startTime instanceof Date
              ? getHoursMinutesSeconds(startTime)
              : startTime || undefined
          }
        />
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
        <input
          id="endTime"
          onChange={onEndChange}
          type="time"
          value={
            endTime && endTime instanceof Date
              ? getHoursMinutesSeconds(endTime)
              : endTime || undefined
          }
        />
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
