// basic usage
// in some react component
import React from "react";
import TimePicker from "react-times";

// use material theme
// import "react-times/css/material/default.css";
// or you can use classic theme
import "react-times/css/classic/default.css";

export default class SomeComponent extends React.Component {
  // do some work
  onHourChange(hour) {
    // do something
    console.log("on hour change");
  }

  onMinuteChange(minute) {
    // do something
    console.log("on minute change");
  }

  onTimeChange(time) {
    // do something
    console.log("on time change");
  }

  onFocusChange(focusStatue) {
    // do something
    console.log("on focus change");
  }

  onMeridiemChange(meridiem) {
    // do something
    console.log("on meridiem change");
  }

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
