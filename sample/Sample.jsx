import React, { Component } from 'react';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';

import './Sample.less';

const now = new Date();
const nextHour = new Date();
nextHour.setHours(nextHour.getHours() + 1);

export default class Sample extends Component {
  state = {
    value: [now, nextHour],
  }

  onChange = value => this.setState({ value })

  render() {
    const { value } = this.state;

    return (
      <div className="Sample">
        <header>
          <h1>react-timerange-picker sample page</h1>
        </header>
        <div className="Sample__container">
          <main className="Sample__container__content">
            <TimeRangePicker
              onChange={this.onChange}
              value={value}
            />
          </main>
        </div>
      </div>
    );
  }
}
