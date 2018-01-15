import React, { Component } from 'react';
import Form from './Form';
import Input from '../Input';
import moment from 'moment';
import classNames from 'classnames';
import smoothScroll from '../../../helpers/smoothScroll';

export const initialState = {
  venue: '',
  address: '',
  phone: '',
  date: '',
  showTime: '',
  loadIn: '',
  type: '',
  notes: '',
};
class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onError = this.onError.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.handleAsyncUpdateButtonClick = this.handleAsyncUpdateButtonClick.bind(this);
  }

  componentDidMount() {
    this.setState({
      venue: this.props.event.venue || '',
      address: this.props.event.address || '',
      phone: this.props.event.phone || '',
      date: this.props.event.date || '',
      showTime: this.props.event.showTime || '',
      loadIn: this.props.event.loadIn || '',
      type: this.props.event.type,
      notes: this.props.event.notes || '',
      id: this.props.event.id,
    })
  }

  onSubmit(event) {
    event.preventDefault();
    if(this.refs.form.validate()) {
      this.handleAsyncUpdateButtonClick();
      // this.props.onSubmit();
    }
  }

  onCancel() {
    this.setState({
      venue: this.props.event.venue || '',
      address: this.props.event.address || '',
      phone: this.props.event.phone || '',
      date: this.props.event.date || '',
      showTime: this.props.event.showTime || '',
      loadIn: this.props.event.loadIn || '',
      type: this.props.event.type,
      notes: this.props.event.notes || '',
      id: this.props.event.id,
    })
    this.props.handleFormEdit();
  }

  onSuccess() {
    this.props.handleFormEdit();
    smoothScroll(document.body, 500);
    this.props.onGetEvent(this.props.event.id, this.props.band.id);
  }

  onError(err) {
    console.log('An error occurred: ' + err)
  }

  handleAsyncUpdateButtonClick() {
    Promise.resolve()
    .then(this.updateEvent())
    .then(() => this.onSuccess())
    .catch(err => this.onError(err));
  }

  updateEvent() {
    const event = {
      venue: this.state.venue,
      address: this.state.address,
      phone: this.state.phone,
      date: new Date(this.state.date).toISOString(),
      showTime: this.state.showTime,
      loadIn: this.state.loadIn,
      notes: this.state.notes,
      type: this.state.type,
      status: new Date(this.state.date) > new Date() ? 'upcoming' : 'past',
      id: this.state.id,
      bandId: this.props.event.bandId,
      bandName: this.props.event.bandName,
    }
    this.props.onUpdateEvent(event, this.props.band, this.props.user)
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { event } = this.props;
    if (event) {
      let formBottomClasses = classNames('form__bottom', 'event-details__form__bottom', { 'form__bottom--hidden': !this.props.eventEdit });
      return (
        <Form
          className="event-details__form"
          id="event-details__form"
          onSubmit={ this.onSubmit }
          onCancel={ this.onCancel }
          disabled={ !this.props.eventEdit }
          ref="form"
          // error={ createError || uploadError }
        >
          <div className="form__middle">
            <div className="form__column">
              <div className="form__row">
                <Input type="text"
                  name="venue"
                  placeholder="Venue Name"
                  label="Venue Name"
                  disabled={ !this.props.eventEdit }
                  value={ this.props.eventEdit ? this.state.venue : event.venue }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="text"
                  name="address"
                  placeholder="Venue Address"
                  label="Venue Address"
                  disabled={ !this.props.eventEdit }
                  value={ this.props.eventEdit ? this.state.address : <a href={`http://maps.google.com/?q=${event.address}`} target="_blank">{event.address}</a> }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                </div>
                <div className="form__row">
                <Input type="text"
                  name="phone"
                  placeholder="Venue Phone"
                  label="Venue Phone"
                  disabled={ !this.props.eventEdit }
                  value={ this.props.eventEdit ? this.state.phone : <a href="tel:${event.phone}">{event.phone}</a> }
                  onChange={ this.handleInputChange }
                  // validation={{ isLength: { min: 10, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="date"
                  name="date"
                  placeholder="Date"
                  label="Event Date"
                  disabled={ !this.props.eventEdit }
                  value={ this.props.eventEdit ? moment(this.state.date).format('MM/DD/YYYY') : moment(event.date).format('MM/DD/YYYY') }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              </div>
              <div className="form__row">
                <Input type="text"
                  name="showTime"
                  placeholder="Show Time"
                  label="Show Time"
                  disabled={ !this.props.eventEdit }
                  value={ this.props.eventEdit ? this.state.showTime : event.showTime }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="text"
                  name="loadIn"
                  placeholder="Load In Time"
                  label="Load In Time"
                  disabled={ !this.props.eventEdit }
                  value={ this.props.eventEdit ? this.state.loadIn : event.loadIn }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              </div>
              <div className="form__row">
                <Input type="select"
                  name="type"
                  placeholder="Show/Rehearsal"
                  label="Event Type"
                  disabled={ !this.props.eventEdit }
                  options={[{value: "show", label: 'Show'}, {value: "rehearsal", label: 'Rehearsal'}]}
                  value={ this.props.eventEdit ? this.state.type : event.type }
                  onChange={ this.handleInputChange }
                  validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
                <Input type="textarea"
                  name="notes"
                  placeholder="Notes"
                  label="Notes"
                  disabled={ !this.props.eventEdit }
                  value={ this.props.eventEdit ? this.state.notes : event.notes }
                  onChange={ this.handleInputChange }
                  // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
              </div>
              <div className="form__column">
              </div>
            </div>
          <div className={ formBottomClasses }>
            <Input type="button-thin-cancel" value="Cancel" />
            <Input type="button-thin-submit" value="Save" />
          </div>
          </div>
        </Form>
      )
    } else {
      return (
        <div>One moment please...</div>
      )
    }
  }
}

export default EventDetails;
