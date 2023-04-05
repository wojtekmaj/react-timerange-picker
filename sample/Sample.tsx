import React, { useState } from 'react';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';

import './Sample.css';

type ValuePiece = Date | string | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const now = new Date();
const nextHour = new Date();
nextHour.setHours(nextHour.getHours() + 1);

export default function Sample() {
  const [value, onChange] = useState<Value>([now, nextHour]);

  return (
    <div className="Sample">
      <header>
        <h1>react-timerange-picker sample page</h1>
      </header>
      <div className="Sample__container">
        <main className="Sample__container__content">
          <TimeRangePicker onChange={onChange} value={value} />
        </main>
      </div>
    </div>
  );
}
