import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/gig.actions';
import { dismissNotification } from '../actions/notification.actions';
import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';
import Form from '../components/Global/Form';
import Input from '../components/Global/Input';
import Notification from '../components/Global/Notification';
import Map from '../components/Map';
import moment from 'moment';
import history from '../history';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import smoothScroll from '../helpers/smoothScroll';

import database from '../config/fire'

export const initialState = {
  venue: '',
  address: '',
  phone: '',
  date: '',
  showTime: '',
  loadIn: '',
  type: '',
  notes: '',
  disabled: true,
};
class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    // this.props.onGetGig(this.id)


    this.db = database.ref().child('gigs');
    this.id = window.location.pathname.split('/')[5];

    console.log(this.id);

    this.toggleCreateGigform = this.toggleCreateGigform.bind(this);
    // this.onUpdateGigSubmit = this.onUpdateGigSubmit.bind(this);
    // this.onUpdateGigCancel = this.onUpdateGigCancel.bind(this);
    this.onDeleteGigSuccess = this.onDeleteGigSuccess.bind(this);
    this.onDeleteGigError = this.onDeleteGigError.bind(this);
    // this.deleteGig = this.deleteGig.bind(this);
    this.restoreGig = this.restoreGig.bind(this);
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
    // this.db.on('child_changed', () => {
      // this.props.onGetGig(this.id)
    // })
    this.props.onGetGig(this.id)
  }

  handleFormEdit() {
    const form = document.querySelector('#event-details__form');
    // const form = this.refs.form;
    this.setState({
      disabled: !this.state.disabled,
      venue: this.props.gig.venue || '',
      address: this.props.gig.address || '',
      phone: this.props.gig.phone || '',
      date: this.props.gig.date || '',
      showTime: this.props.gig.showTime || '',
      loadIn: this.props.gig.loadIn || '',
      type: this.props.gig.type,
      notes: this.props.gig.notes || '',
      id: this.id
    })

    if (this.state.disabled) {
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
  }

  onSuccess() {
    this.setState({
      disabled: true
    })
    smoothScroll(document.body, 500);
    this.props.onGetGig(this.id);
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
    const gig = {
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
    this.props.onUpdateEvent(gig)
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

  toggleCreateGigform() {
    this.setState(prevState => ({
      showCreateGigform: !prevState.showCreateGigform
    }));
  }


  onDeleteGigSuccess() {
    this.props.onGetGig();
    // alert('Show successfully deleted');
  }

  onDeleteGigError() {
    this.props.onGetGig();
    alert('An error occured :(');
  }

  restoreGig() {
    if (this.props.recentlyDeleted.length > 0) {
      this.props.onRestoreGig(this.props.recentlyDeleted[this.props.recentlyDeleted.length - 1])
    } else {
      console.log('no gigs to restore');
      this.props.dismissNotification();
    }
  }

  renderNotification() {
    const { notification } = this.props;
    return (
      <Notification
        action={this.restoreGig}
        actionLabel={notification.actionLabel}
        dismiss={this.props.dismissNotification}
        display={notification.display}
        message={notification.message}
      />
    );
  }

  renderForm() {
    const { gig } = this.props;
    if (gig) {
      let formBottomClasses = classNames('form__bottom', 'event-details__form__bottom', { 'form__bottom--hidden': this.state.disabled });
      return (
        <Form
            // className="form__container"
            className="event-details__form"
            id="event-details__form"
            onSubmit={ this.onSubmit }
            onCancel={ this.onCancel }
            disabled={ this.state.disabled }
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
                    value={ this.state.disabled ? gig.venue : this.state.venue }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  <Input type="text"
                    name="address"
                    placeholder="Venue Address"
                    label="Venue Address"
                    value={ this.state.disabled ? gig.address : this.state.address }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  </div>
                  <div className="form__row">
                  <Input type="text"
                    name="phone"
                    placeholder="Venue Phone"
                    label="Venue Phone"
                    value={ this.state.disabled ? gig.phone : this.state.phone }
                    onChange={ this.handleInputChange }
                    // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  <Input type="date"
                    name="date"
                    placeholder="Date"
                    label="Event Date"
                    value={ this.state.disabled ? moment(gig.date).format('MM/DD/YYYY') : moment(this.state.date).format('MM/DD/YYYY')  }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                </div>
                <div className="form__row">
                  <Input type="text"
                    name="showTime"
                    placeholder="Show Time"
                    label="Show Time"
                    value={ this.state.disabled ? gig.showTime : this.state.showTime }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  <Input type="text"
                    name="loadIn"
                    placeholder="Load In Time"
                    label="Load In Time"
                    value={ this.state.disabled ? gig.loadIn : this.state.loadIn }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                </div>
                <div className="form__row">
                  <Input type="select"
                    name="type"
                    placeholder="Show/Rehearsal"
                    label="Event Type"
                    options={[{value: "show", label: 'Show'}, {value: "rehearsal", label: 'Rehearsal'}]}
                    value={ this.state.disabled ? gig.type : this.state.type }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  <Input type="textarea"
                    name="notes"
                    placeholder="Notes"
                    label="Notes"
                    value={ this.state.disabled ? gig.notes : this.state.notes }
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

    // Subheader
    // let breadcrumbs = [
    //   { link: (authenticated) ? `/${match.params.userId}/projects` : null, name: 'Projects' },
    //   { link: null, name: project.name },
    // ];

    let breadcrumbs = this.props.gig ? [
      // { link: `/${match.params.userId}/gigs` : null, name: 'Gigs' },
      // { link: `/testUser/bands/testBand/gigs`, name: '<' },
      { link: `/testUser/bands/testBand/gigs`, name: <i className="icon material-icons">chevron_left</i> },
      { link: null, name: this.props.gig.venue },
      { link: null, name: moment(this.props.gig.date).format('MM/DD/YY') },
    ] :
    [
      // { link: `/${match.params.userId}/gigs` : null, name: 'Gigs' },
      // { link: `/testUser/bands/testBand/gigs`, name: '<' },
      { link: `/testUser/bands/testBand/gigs`, name: 'Event:' },
    ];

    let classes = classNames("event-details__container", {"event-details__container--hidden": !this.state.disabled})

    return (
      <div className='page__container'>
        <Drawer
          // userName={ userName }
          show={ true }
          className="drawer__sidebar"
          // toggle={ this.toggleDrawer }
        />
        <div className='page__content--two-col'>
        <Subheader breadcrumbs={ breadcrumbs }
          // buttonHide={ !this.state.disabled }
          buttonLabel={ this.state.disabled ? 'Edit' : 'Save'}
          buttonIcon={ this.state.disabled ? 'edit' : 'save' }
          buttonOnClick={ this.state.disabled ? this.handleFormEdit : this.onSubmit }
        />
        <div className={ classes }>
          {/* <div className="form__top">
            <h3 className="clr-purple">Edit Event</h3>
          </div> */}
          { this.props.gig ?
          <Map
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCGaFX5PzypU4uZ2RT-l-OU9A6-6aIxmBk&v=3.exp&libraries=geometry,drawing,places"
            center={ this.props.gig.address }
          /> : null
          }
        { this.props.isLoading ? null : this.renderForm() }
      </div>
      </div>
      </div>
    );
  }
}

// export default EventDetails;

function mapStateToProps(state) {
  return {
    gig: state.gigs.activeGig,
    isLoading: state.app.loading,
    notification: state.notification,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onGetGig: actions.getGig,
    onDeleteGig: actions.deleteGig,
    onRestoreGig: actions.restoreGig,
    onUpdateEvent: actions.updateEvent,
    dismissNotification: dismissNotification,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);