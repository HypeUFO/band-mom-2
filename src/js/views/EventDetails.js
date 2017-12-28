import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/event.actions';
import { getBand } from '../actions/band.actions';
import { dismissNotification } from '../actions/notification.actions';
import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';
import Form from '../components/Global/Form';
import Loader from '../components/Global/Loader';
import Input from '../components/Global/Input';
import Notification from '../components/Global/Notification';
import Map from '../components/Map';
import moment from 'moment';
import history from '../history';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import smoothScroll from '../helpers/smoothScroll';

import { database } from '../config/fire'

export const initialState = {
  venue: '',
  address: '',
  phone: '',
  date: '',
  showTime: '',
  loadIn: '',
  type: '',
  notes: '',
  // disabled: true,
};
class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.id = window.location.pathname.split('/')[5];

    this.toggleCreateEventform = this.toggleCreateEventform.bind(this);
    // this.onUpdateEventSubmit = this.onUpdateEventSubmit.bind(this);
    // this.onUpdateEventCancel = this.onUpdateEventCancel.bind(this);
    this.onDeleteEventSuccess = this.onDeleteEventSuccess.bind(this);
    this.onDeleteEventError = this.onDeleteEventError.bind(this);
    // this.deleteEvent = this.deleteEvent.bind(this);
    this.restoreEvent = this.restoreEvent.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);

    this.handleAsyncUpdateButtonClick = this.handleAsyncUpdateButtonClick.bind(this);

    this.handleFormEdit = this.handleFormEdit.bind(this);
  }

  componentWillMount() {
    // database.ref(`bands/${this.props.band.id}/`).child('events').on('child_changed', () => {
    //   this.props.onGetEvent(this.id, this.props.band.id)
    // })
    Promise.resolve()
    .then(() => {
      this.props.onGetEvent(this.props.match.params.eventId, this.props.match.params.bandId)
    })
    .then(() => {
      this.props.onGetBand(this.props.match.params.bandId)
      this.setState({
        // disabled: !!this.props.eventEdit,
        venue: this.props.event.venue || '',
        address: this.props.event.address || '',
        phone: this.props.event.phone || '',
        date: this.props.event.date || '',
        showTime: this.props.event.showTime || '',
        loadIn: this.props.event.loadIn || '',
        type: this.props.event.type,
        notes: this.props.event.notes || '',
        id: this.id
      })
    })
    .catch((err) => console.log(err));
  }

  // componentDidMount() {
  //   console.log('ComponentDidMount' + this.props.eventEdit)
  //   if (this.props.eventEdit) {
  //     const form = this.refs.form;
  //     smoothScroll(form, 500);
  //   }
  // }

  handleFormEdit() {
    const form = document.querySelector('#bottom');
    // const form = this.refs.form;
    this.setState({
      // disabled: !!this.props.eventEdit,
      venue: this.props.event.venue || '',
      address: this.props.event.address || '',
      phone: this.props.event.phone || '',
      date: this.props.event.date || '',
      showTime: this.props.event.showTime || '',
      loadIn: this.props.event.loadIn || '',
      type: this.props.event.type,
      notes: this.props.event.notes || '',
      id: this.id
    })
    this.props.updateEventEdit();
    if (!this.props.eventEdit) {
      // form.scrollIntoView();
      smoothScroll(form, 500);
    } else {
      // document.body.scrollTop = 0; // For Safari
      // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      smoothScroll(document.body, 500);
    }
  }

  onSubmit(event) {
    event.preventDefault();
    if(this.refs.form.validate()) {
      this.handleAsyncUpdateButtonClick();
      // this.props.onSubmit();
    }
  }

  onCancel() {
    this.handleFormEdit();
    // this.props.updateEventEdit();
  }

  onSuccess() {
    // this.setState({
    //   disabled: true
    // })
    this.props.updateEventEdit();
    smoothScroll(document.body, 500);
    this.props.onGetEvent(this.id, this.props.band.id);
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
    const bandId = this.props.band.id;
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
    }
    this.props.onUpdateEvent(event, bandId)
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleRowClick(row) {
    // history.push(`/${this.props.match.params.userId}/bands/testBand/events/${row._id}/`);
    // history.push(`/testUser/bands/testBand/gigs/${row.id}/details`);
  }

  handleRowMenuItemClick(doc, action, event) {
    event.stopPropagation();
  }

  toggleCreateEventform() {
    this.setState(prevState => ({
      showCreateEventform: !prevState.showCreateEventform
    }));
  }


  onDeleteEventSuccess() {
    this.props.onGetEvent();
    // alert('Show successfully deleted');
  }

  onDeleteEventError() {
    this.props.onGetEvent();
    alert('An error occured :(');
  }

  restoreEvent() {
    if (this.props.recentlyDeleted.length > 0) {
      this.props.onRestoreEvent(this.props.recentlyDeleted[this.props.recentlyDeleted.length - 1], this.props.band.id)
    } else {
      console.log('no Events to restore');
      this.props.dismissNotification();
    }
  }

  renderNotification() {
    const { notification } = this.props;
    return (
      <Notification
        action={this.restoreEvent}
        actionLabel={notification.actionLabel}
        dismiss={this.props.dismissNotification}
        display={notification.display}
        message={notification.message}
      />
    );
  }

  renderForm() {
    const { event } = this.props;
    if (event) {
      let formBottomClasses = classNames('form__bottom', 'event-details__form__bottom', { 'form__bottom--hidden': !this.props.eventEdit });
      return (
        <Form
            // className="form__container"
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
                    // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
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
                  {/* { this.renderFiles() } */}
                </div>
              </div>
            <div
            // className="form__bottom"
            className={ formBottomClasses }
            >
              <Input type="button-thin-cancel" value="Cancel" />
              <Input type="button-thin-submit" value="Save" />
              {/* { formBottom } */}
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

  render() {
    const {
      event,
      eventEdit,
      band,
      match,
    } = this.props;

    // Subheader
    // let breadcrumbs = [
    //   { link: (authenticated) ? `/${match.params.userId}/projects` : null, name: 'Projects' },
    //   { link: null, name: project.name },
    // ];

    let breadcrumbs = event  && band ? [
      // { link: `/${match.params.userId}/bands/${match.params.bandId}/events`, name: <i className="icon material-icons">chevron_left</i> },
      { link: `/${match.params.userId}/bands/${match.params.bandId}/dashboard`, name: band.name },
      { link: `/${match.params.userId}/bands/${match.params.bandId}/events`, name: 'Events' },
      { link: null, name: `${event.venue}: ${moment(event.date).format('MM/DD/YY')}` },
    ] :
    [
      { link: `/${match.params.userId}/bands/${match.params.bandId}/events`, name: 'Event:' },
    ];

    let classes = classNames("event-details__container", {"event-details__container--hidden": !!eventEdit})
    return (
      <div className='page__container'>
        <Drawer
          // userName={ userName }
          show={ true }
          className="drawer__sidebar"
          // toggle={ this.toggleDrawer }
        />
         <Subheader breadcrumbs={ breadcrumbs }
          // buttonHide={ eventEdit }
          buttonLabel={ !eventEdit ? 'Edit' : 'Save'}
          buttonIcon={ !eventEdit ? 'edit' : 'save' }
          buttonOnClick={ !eventEdit ? this.handleFormEdit : this.onSubmit }
        />
        <div className='page__content page__content--two-col'>
          <div className={ classes }>
            {/* <div className="form__top">
              <h3 className="clr-purple">Edit Event</h3>
            </div> */}
            { event ?
            <Map
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCGaFX5PzypU4uZ2RT-l-OU9A6-6aIxmBk&v=3.exp&libraries=geometry,drawing,places"
              // center={ this.props.event.address }
            /> : null
            }
          { this.props.isLoading ? <Loader /> : this.renderForm() }
            <div id="bottom" style={{width: '100%', height: 80}}></div>
          </div>
        </div>
      </div>
    );
  }
}

// export default EventDetails;

function mapStateToProps(state) {
  return {
    user: state.app.user,
    event: state.events.activeEvent,
    band: state.bands.activeBand,
    isLoading: state.app.loading,
    notification: state.notification,
    eventEdit: state.events.edit,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onGetEvent: actions.getEvent,
    onGetBand: getBand,
    onDeleteEvent: actions.deleteEvent,
    onRestoreEvent: actions.restoreEvent,
    onUpdateEvent: actions.updateEvent,
    dismissNotification: dismissNotification,
    updateEventEdit: actions.updateEventEdit,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);