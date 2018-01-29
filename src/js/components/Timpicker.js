import React from "react";
import TimePicker from "react-times";

import "react-times/css/classic/default.css";

export default class SomeComponent extends React.Component {
  render() {
    const {
      name,
      time,
      meridiem,
      onFocusChange,
      onHourChange,
      onMeridiemChange,
      onMinuteChange,
      onTimeChange,
      onChange
    } = this.props;
    return (
      <TimePicker
        onFocusChange={onFocusChange}
        onHourChange={onHourChange}
        onMinuteChange={onMinuteChange}
        onTimeChange={onChange}
        onMeridiemChange={onMeridiemChange}
        meridiem={meridiem}
        theme="classic"
        timeMode="12" // use 24 or 12 hours mode, default 24
        className="input__input"
        time={time}
        name={name}
      />
    );
  }
}
