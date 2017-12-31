import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/event.actions';
import { getBand } from '../actions/band.actions';
import { dismissNotification } from '../actions/notification.actions';
import Table from '../components/Global/Table';
import TableRow from '../components/Global/TableRow';
import TableRowMenu from '../components/Global/TableRowMenu';
import TableRowMenuItem from '../components/Global/TableRowMenuItem';
import Drawer from '../components/Global/Drawer';
import Loader from '../components/Global/Loader';
import Subheader from '../components/Global/Subheader';
import Notification from '../components/Global/Notification';

import genres from '../constants/genre_list';

import Form from '../components/Global/Form';

import Carousel from '../components/Carousel';


import CreateEventModal from '../modals/CreateEventModal';
import FilterLink from '../components/Global/FilterLink';
import Input from '../components/Global/Input';
import moment from 'moment';
import history from '../history';

import classNames from 'classnames';

import { database } from '../config/fire'


const initialState = {
  showCreateEventModal: false,
  showShareModal: false,
  selected: '',

  name: '',
  location: '',
  genre1: '',
  genre2: '',
  bio: '',
  logo: '',
  id: '',
};

class BandDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    // this.db = database.ref().child('bands');
    this.id = window.location.pathname.split('/')[3];

    this.toggleCreateEventModal = this.toggleCreateEventModal.bind(this);
    this.onCreateEventSubmit = this.onCreateEventSubmit.bind(this);
    this.onCreateEventCancel = this.onCreateEventCancel.bind(this);
    // this.onDeleteEventSuccess = this.onDeleteEventSuccess.bind(this);
    // this.onDeleteEventError = this.onDeleteEventError.bind(this);
    // this.deleteEvent = this.deleteEvent.bind(this);
    // this.restoreEvent = this.restoreEvent.bind(this);

  }

  componentWillMount() {
    console.log(this.id);
    Promise.resolve()
    .then(() => {
      this.props.onGetBand(this.id)
    })
    .then(() => {
      console.log(this.props.band);
      this.setState({
        // disabled: !!this.props.bandEdit,
        name: this.props.band.name || '',
        location: this.props.band.location || '',
        genre1: this.props.band.genre1 || '',
        genre2: this.props.band.genre2 || '',
        bio: this.props.band.bio || '',
        stageplots: this.props.band.stageplots || '',
        logo: this.props.band.logo,
      })
    })
    .catch((err) => console.log(err));

    database.ref(`events`).on('child_added', () => {
    // database.ref(`bands/${this.id}/`).child('events').on('child_added', () => {
      this.props.onGetEventMany((this.id))
    })
    this.props.onClearEvent()
    // if (!this.props.events) {
    //   this.props.onGetEventMany()
    // }
  }

  handleRowClick(row) {
    history.push(`/testUser/bands/testBand/events/${row.id}/details`);
  }

  handleRowMenuItemClick(doc, action, event) {
    event.stopPropagation();
  }

  toggleCreateEventModal() {
    this.setState(prevState => ({
      showCreateEventModal: !prevState.showCreateEventModal
    }));
  }

  onCreateEventSubmit() {
    console.log('Event submitted');
    this.toggleCreateEventModal();
  }

  onCreateEventCancel() {
    this.toggleCreateEventModal();
  }

  onCreateEventSuccess() {
    console.log('Show successfully created');
  }

  onCreateEventError(err) {
    console.log('An error occured:' + err);
  }

  // deleteEvent(event) {
  //   this.props.onDeleteEvent(event)
  //   // this.db.child(gigId).remove()
  //   .then(() => this.onDeleteEventSuccess())
  //   .catch(err => this.onDeleteEventError())
  // }

  // onDeleteEventSuccess() {
  //   this.props.onGetEventMany();
  //   // alert('Show successfully deleted');
  // }

  // onDeleteEventError() {
  //   this.props.onGetEventMany();
  //   alert('An error occured :(');
  // }

  // restoreEvent() {
  //   if (this.props.recentlyDeleted.length > 0) {
  //     this.props.onRestoreEvent(this.props.recentlyDeleted[this.props.recentlyDeleted.length - 1])
  //   } else {
  //     console.log('no Events to restore');
  //     this.props.dismissNotification();
  //   }
  // }

  // renderNotification() {
  //   const { notification } = this.props;
  //   return (
  //     <Notification
  //       action={this.restoreEvent}
  //       actionLabel={notification.actionLabel}
  //       dismiss={this.props.dismissNotification}
  //       display={notification.display}
  //       message={notification.message}
  //     />
  //   );
  // }

  renderEventCard(doc, index) {

    let statusColorClass = '';
    switch(doc.status) {
      case 'upcoming':
        // statusColorClass = 'clr-purple';
        break;
      case 'past':
        statusColorClass = 'clr-red';
        break;
      default:
        // statusColorClass = 'clr-purple';
    }


    let card = (
        <div>
          <h3><span className="card__type">{doc.type.toUpperCase()}</span> @ { doc.venue }</h3>
          <p>{ moment(doc.date).format('MM/DD/YYYY')} </p>
          <p>Set Time: { doc.showTime }</p>
        </div>
    );

    return (
      <a
        href={`/${this.props.match.params.userId}/bands/${this.props.match.params.bandId}/events/${doc.id}/details`}
        className="card__link"
        key={ index }
      >
        <div className="card"
          key={ doc.date }
          onClick={ this.handleRowClick.bind(this, doc) }
        >
          { card }
        </div>
      </a>
    );
  }

  // sortData(docs) {
  //   let events;
  //   // Sort data
  //   events = Object.keys(docs)

  //   return {
  //     events,
  //   };
  // }

  renderEventPreview() {
    const { events } = this.props;
      if(events && Object.keys(events).length > 0 && events.constructor === Object) {
        // let results = this.sortData(events);
        // console.log(results);

        let rows = Object.keys(events).map((key) => {
          // console.log('rendering row')
          events[key].id = key;

          if (events[key].status === 'upcoming') {
            return this.renderEventCard(events[key], key)
          }
        })
        .sort((a, b) => {
          const valueA = new Date(a.key);
          const valueB = new Date(b.key);
          return (valueB < valueA) ? 1 : (valueB > valueA) ? -1 : 0;
        })

        return (
          <Carousel>
            { rows }
          </Carousel>
        );
      }
      else {
        return (
          // <NoContent text="No Shows" />
          <div className="no-content__wrapper">
            <div>No Events</div>
          </div>
        );
      }
  }

  render() {

    // Subheader
    // let breadcrumbs = [
    //   { link: (authenticated) ? `/${match.params.userId}/projects` : null, name: 'Projects' },
    //   { link: null, name: project.name },
    // ];

    const {
      user,
      band
    } = this.props;
    // const userId = user.uid;
    // const bandId = band.id;


    let breadcrumbs = [
      // { link: `/${match.params.userId}/gigs` : null, name: 'Gigs' },
      { link: null, name: 'Test Band' },
      // { link: null, name: gig.venue },
    ];

    if (band) {
    let formBottomClasses = classNames('form__bottom', 'band-details__form__bottom', { 'form__bottom--hidden': !this.props.bandEdit });

    return (
      <div className='page__container'>
        <Drawer
          // userName={ userName }
          show={ true }
          className="drawer__sidebar"
          // toggle={ this.toggleDrawer }
        />
        <Subheader breadcrumbs={ breadcrumbs }
          // buttonHide={ buttonHide }
          buttonHide={ true }
          // buttonLabel="Add Show"
          // buttonIcon="add"
          // buttonOnClick={ this.toggleCreateEventModal }
        />
        <div className='page__content page__content--two-col'>
          <div className="page__content__container">
          {/* <div className="event__preview__container"> */}
          <a href={`/${this.props.match.params.userId}/bands/${this.props.match.params.bandId}/details`}><h3>Edit Band Details</h3></a>
          <div className="band__details__container">
          <div className="band__details__image__wrapper">
            <img
              src={band.logoUrl || "https://www.timeshighereducation.com/sites/default/files/byline_photos/anonymous-user-gravatar_0.png"}
              alt="Logo"
              className="band__logo"
            />
          </div>
          <Form
            // className="form__container"
            className="band__details__form"
            id="band-details__form"
            onSubmit={ this.onSubmit }
            onCancel={ this.onCancel }
            disabled={ !this.props.bandEdit }
            ref="form"
            // error={ createError || uploadError }
          >
            <div className="form__middle form__middle__band-dashboard">
              <div className="form__column">
                <div className="form__row">
                  <Input type="text"
                    name="name"
                    placeholder="Band Name"
                    label="Band Name"
                    disabled={ !this.props.bandEdit }
                    value={ this.props.bandEdit ? this.state.name : band.name }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  <Input type="text"
                    name="location"
                    placeholder="Location"
                    label="Location"
                    disabled={ !this.props.bandEdit }
                    value={ this.props.bandEdit ? this.state.location : band.location }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  </div>
                  <div className="form__row">
                  <Input type="select"
                    name="genre1"
                    placeholder="Genre 1"
                    label="Genre 1"
                    disabled={ !this.props.bandEdit }
                    options={genres}
                    value={ this.props.bandEdit ? this.state.genre1 : band.genre1 }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  <Input type="select"
                    name="genre2"
                    placeholder="Genre 2"
                    label="Genre 2"
                    disabled={ !this.props.bandEdit }
                    options={genres}
                    value={ this.props.bandEdit ? this.state.genre2 : band.genre2 }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                </div>
                <div className="form__row">
                  <Input type="textarea"
                    name="bio"
                    placeholder="Bio"
                    label="Bio"
                    disabled={ !this.props.bandEdit }
                    value={ this.props.bandEdit ? this.state.bio : band.bio }
                    onChange={ this.handleInputChange }
                    // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                </div>
                <div className="form__column">
                  {/* { this.renderFiles() } */}
                </div>
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
          </Form>
          </div>
          <div className="slide-header">
            <h3>Upcoming Events</h3>
            <a href={`/${this.props.match.params.userId}/bands/${this.props.match.params.bandId}/events`}>View All</a>
          </div>
            { this.renderEventPreview() }
          
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <Loader />
    )
  }
  }
}

function mapStateToProps(state) {
  return {
    events: state.events.events,
    band: state.bands.activeBand,
    user: state.app.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onGetBand: getBand,
    onClearEvent: actions.clearEvent,
    onGetEvent: actions.getEvent,
    onGetEventMany: actions.getEventMany,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BandDashboard);