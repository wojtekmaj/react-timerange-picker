const fs = require('fs');

fs.copyFile('src/TimeRangePicker.css', 'dist/TimeRangePicker.css', (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log('TimeRangePicker.css copied successfully.');
});
