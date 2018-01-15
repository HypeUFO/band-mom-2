import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import classNames from 'classnames';
import * as actions from '../actions/event.actions';
import { getBand } from '../actions/band.actions';
import { dismissNotification } from '../actions/notification.actions';
import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';
import EventEditForm from '../components/Global/Forms/EventEditForm';
import Map from '../components/Map';
import Loader from '../components/Global/Loader';
import Spinner from '../components/Global/Spinner';
import smoothScroll from '../helpers/smoothScroll';
import { database } from '../config/fire'

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.renderForm = this.renderForm.bind(this);
    this.handleFormEdit = this.handleFormEdit.bind(this);
  }

  componentWillMount() {
    database.ref('events').child(this.props.match.params.eventId).on('value', () => {
      Promise.resolve()
      .then(() => {
        this.props.onGetEvent(this.props.match.params.eventId, this.props.match.params.bandId)
        this.props.onGetBand(this.props.match.params.bandId)
      })
      .catch((err) => console.log(err));
    })
  }

  handleFormEdit() {
    const form = document.querySelector('#bottom');
    this.props.updateEventEdit();
    if (!this.props.eventEdit) {
      smoothScroll(form, 500);
    } else {
      smoothScroll(document.body, 500);
    }
  }

  renderForm() {
    const { event } = this.props;
    if (event) {
      return (
        <EventEditForm
          event={ this.props.event }
          eventEdit={ this.props.eventEdit }
          onUpdateEvent={ this.props.onUpdateEvent }
          band={ this.props.band }
          user={ this.props.user }
          handleFormEdit={ this.handleFormEdit }
        />
      )
    } else {
      return (
        // <div>One moment please...</div>
        <Loader />
        // <Spinner />
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
    let breadcrumbs = event  && band ? [
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
          show={ true }
          className="drawer__sidebar"
        />
        <Subheader breadcrumbs={ breadcrumbs }
          buttonLabel={ !eventEdit ? 'Edit' : 'Save'}
          buttonIcon={ !eventEdit ? 'edit' : 'save' }
          buttonOnClick={ !eventEdit ? this.handleFormEdit : this.onSubmit }
        />
        <div className='page__content page__content--two-col'>
          <div className={ classes }>
            { event ?
            <Map
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCGaFX5PzypU4uZ2RT-l-OU9A6-6aIxmBk&v=3.exp&libraries=geometry,drawing,places"
              // center={ this.props.event.address }
            /> : null
            }
            { this.renderForm() }
            <div id="bottom" style={{width: '100%', height: 80}}></div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
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