const fs = require('fs');

fs.copyFile('src/TimeRangePicker.less', 'dist/TimeRangePicker.less', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('TimeRangePicker.less copied successfully.');
});
