import 'rc-time-picker/assets/index.css';
import styles from "./stylesheets/DSUEntry.less";
import React from 'react';
import TimePicker from 'rc-time-picker';
const format = 'h:mm a';
// const now = moment().hour(0).minute(0);
const DateTimePicker = ({onChange}) => {
  return (
    <div>
      <TimePicker
        style={{ width: "100%" }}
        showSecond={false}
        // defaultValue={now}
        disabled={false}
        className={styles.xxx}
        onChange={onChange}
        format={format}
        use12Hours
        inputReadOnly
        placeholder="HH:MM AM"
      />
    </div>
  )
}

export default DateTimePicker;
