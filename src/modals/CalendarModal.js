import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

const DATE_FORMAT = 'MM/DD/YYYY';

export default class CalendarModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    onClickCancel: PropTypes.func,
    onClickOk: PropTypes.func,
    value: PropTypes.string,
  }

  constructor(props) {
  	super(props);
  	let date = moment(DATE_FORMAT);
  	let selectedDate = moment(DATE_FORMAT);
  	this.state = {
  		date: date,
  		selectedDate: selectedDate,
  	};
  	this.onClickPrevMonth = this.onClickPrevMonth.bind(this);
  	this.onClickNextMonth = this.onClickNextMonth.bind(this);
  	this.onClickDate = this.onClickDate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
  	if (nextProps.show && nextProps.value && nextProps.value != this.state.selectedDate) {
  		let date = moment(nextProps.value, DATE_FORMAT);
  		let selectedDate = moment(nextProps.value, DATE_FORMAT);
  		this.setState(prevState => ({
  			date: date,
  			selectedDate: selectedDate,
  		}));
  	}
  }

  onClickPrevMonth(event) {
    event.preventDefault();
    let date = moment(this.state.date, DATE_FORMAT).subtract(1, 'month');
  	this.setState(prevState => ({
  		date: date,
  	}));
  }

  onClickNextMonth(event) {
    event.preventDefault();
    let date = moment(this.state.date, DATE_FORMAT).add(1, 'month');
  	this.setState(prevState => ({
  		date: date,
  	}));
  }

  onClickDate(event) {
    event.preventDefault();
  	let day = event.target.innerHTML;
  	day = (day.length < 2) ? '0' + day : day;
  	let year = this.state.date.format('YYYY');
  	let month = this.state.date.format('MM');
  	let selectedDate = moment(month + '/' + day + '/' + year, DATE_FORMAT);
  	this.setState(prevState => ({
  		selectedDate: selectedDate
  	}));
  }

  onClickCancel(event) {
    event.preventDefault();
    this.props.onClickCancel(event);
  }

  onClickOk(event) {
    event.preventDefault();
    this.props.onClickOk(event, this.state.selectedDate.format(DATE_FORMAT));
  }


  getDaysInMonth(date, classN, onClick) {
    let days = [];
	  onClick = (onClick) ? onClick.bind(this) : null;

	  let ss = moment(this.state.selectedDate);
		let fd = ss.format('DD');
		let sd = ss.format('MM/YYYY');
		let d = moment(this.state.date).format('MM/YYYY');

    for(let i = 1; i < moment(date).daysInMonth() + 1; i++) {

    	// Only if clickable, we check to see if selected
    	let isSelected = false;
    	if(onClick) {
    		let j = i.toString();
    		j = (j.length < 2) ? '0' + j : j;
    		isSelected = sd == d && fd == j;
    	}

    	let classes = classNames(classN, { 'calender__day--selected': isSelected })
    	days.push(
    		<h4 className={ classes }
    			key={ moment(date).format('MMM') + '-' + i }
    			onClick={ onClick }
    		>
    			{ i }
    		</h4>
    	);
    }

    return days;
  }

  render() {
    const {
      show,
    } = this.props;

    const {
    	date,
    	selectedDate,
    } = this.state;

    let daysOfWeek = {
    	sun: 0,
    	mon: 1,
    	tue: 2,
    	wed: 3,
    	thu: 4,
    	fri: 5,
    	sat: 6,
    };

    let prevDate = date.subtract('1', 'month');
    let nextDate = date.add('1', 'month');

    // Get arrays filled with h5 elements
    let prevDays = this.getDaysInMonth(prevDate, 'calender__non-day', null);
    let currentDays = this.getDaysInMonth(date, 'calender__day', this.onClickDate);
    let nextDays = this.getDaysInMonth(nextDate, 'calender__non-day', null);

    let firstOfMonthDay = moment(date.format('MM/YYYY'), 'MM/YYYY').format('ddd').toLowerCase()
   	let weekDay = daysOfWeek[firstOfMonthDay];

    // Get correct number of previous month days so the first day of
    // the current month lands on the correct week day
    prevDays = prevDays.slice(prevDays.length - weekDay, prevDays.length)

    // Get the correct number of next month days so we have a perfect
    // grid calender
    let totalDays = prevDays.length + currentDays.length;
    let remainder = totalDays % 7;
    let numDaysNeeded = (remainder) ? 7 - totalDays % 7 : 0;
    nextDays = nextDays.slice(0, numDaysNeeded);

    let classes = classNames('modal', { 'modal--active': show });

    return (
      <div className={ classes }>
	      <div className="modal__wrapper">
	        <div className="calender">
	          <div className="calender__top">
	          	<div className="calender__top__left">
	          		<button onClick={ this.onClickPrevMonth }>
	          			<i className="material-icons clr-light">
	          				keyboard_arrow_left
	          			</i>
	          		</button>
	          	</div>
	          	<div className="calender__top__middle">
		            <h4 className="calender__month">{ date.format('MMM') }</h4>
		            <h4 className="calender__year">{ date.format('YYYY') }</h4>
	          	</div>
	          	<div className="calender__top__right">
	          		<button onClick={ this.onClickNextMonth }>
	          			<i className="material-icons clr-light">
	          				keyboard_arrow_right
	          			</i>
	          		</button>
	          	</div>
	          </div>
	          <div className="calender__middle">
	            <h4 className="calender__weekday">S</h4>
	            <h4 className="calender__weekday">M</h4>
	            <h4 className="calender__weekday">T</h4>
	            <h4 className="calender__weekday">W</h4>
	            <h4 className="calender__weekday">T</h4>
	            <h4 className="calender__weekday">F</h4>
	            <h4 className="calender__weekday">S</h4>
	            { prevDays }
	            { currentDays }
	            { nextDays }
	          </div>
	          <div className="calender__bottom">
	            <button className="btn-thin clr-grey" onClick={ this.onClickCancel.bind(this) }>Cancel</button>
	            <button className="btn-thin clr-green" onClick={ this.onClickOk.bind(this) }>Ok</button>
	          </div>
	        </div>
	      </div>
	    </div>
    );

  }
}
