import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/event.actions';
import {
  getBand,
  updateBand,
  updateBandEdit,
  uploadBandLogo,
  uploadStagePlot,
  deleteBand,
  deleteStagePlot,
  restoreBand,
} from '../actions/band.actions';
import { dismissNotification } from '../actions/notification.actions';
import Drawer from '../components/Global/Drawer';
import Loader from '../components/Global/Loader';
import Subheader from '../components/Global/Subheader';
import CreateBandEventModal from '../modals/CreateBandEventModal';



import genres from '../constants/genre_list';

import Form from '../components/Global/Form';

import Carousel from '../components/Carousel';
import Input from '../components/Global/Input';
import moment from 'moment';
import history from '../history';

import classNames from 'classnames';

import { database } from '../config/fire'
import FileUploadModal from '../modals/FileUploadModal';
import AlertModal from '../modals/AlertModal';


const initialState = {
  showCreateBandEventModal: false,
  showAlert: false,
  showShareModal: false,
  selected: '',
  showStageplotModal: false,
  name: '',
  location: '',
  genre1: '',
  genre2: '',
  bio: '',
  logoUrl: '',
  logoName: '',
  id: '',
  stagePlotUrl: '',
  stagePlotName: '',
  selectedStagePlot: '',
};

class BandDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    // this.db = database.ref().child('bands');
    this.id = window.location.pathname.split('/')[3];

    this.toggleCreateBandEventModal = this.toggleCreateBandEventModal.bind(this);
    this.onCreateEventSubmit = this.onCreateEventSubmit.bind(this);
    this.onCreateEventCancel = this.onCreateEventCancel.bind(this);
    this.onCancelStageplotUpload = this.onCancelStageplotUpload.bind(this);
    this.onCancelLogoUpload = this.onCancelLogoUpload.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.onDeleteEventSuccess = this.onDeleteEventSuccess.bind(this);
    // this.onDeleteEventError = this.onDeleteEventError.bind(this);
    // this.deleteEvent = this.deleteEvent.bind(this);
    // this.restoreEvent = this.restoreEvent.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onCancelDeleteStagePlot = this.onCancelDeleteStagePlot.bind(this);
    this.onDeleteStagePlot = this.onDeleteStagePlot.bind(this);

    this.handleAsyncUpdateButtonClick = this.handleAsyncUpdateButtonClick.bind(this);

    // this.handleFormEdit = this.handleFormEdit.bind(this);

  }

  componentWillMount() {
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
        logoUrl: this.props.band.logoUrl || '',
        logoName: this.props.band.logoName || '',
        stagePlotUrl: this.props.stagPlotUrl || '',
        stagePlotName: this.props.stagePlotName || '',
      })
    })
    .catch((err) => console.log(err));

    database.ref(`events`).on('value', () => {
      this.props.onGetEventMany((this.id))
    })
    database.ref(`groups/${this.props.match.params.bandId}`).on('value', () => {
        this.props.onGetBand(this.props.match.params.bandId)
      })
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    if(this.refs.form.validate()) {
      this.handleAsyncUpdateButtonClick();
      // this.props.onSubmit();
    }
  }

  onCancel() {
    // this.handleFormEdit();
    this.props.updateBandEdit();
  }

  onSuccess() {
    this.props.updateBandEdit();
    this.props.onGetBand(this.id);
  }

  onError(err) {
    console.log('An error occurred: ' + err)
  }

  handleAsyncUpdateButtonClick() {
    Promise.resolve()
    .then(this.updateBand())
    .then(() => this.onSuccess())
    .catch(err => this.onError(err));
  }

  updateBand() {
    const band = {
      name: this.state.name,
      location: this.state.location,
      genre1: this.state.genre1,
      genre2: this.state.genre2,
      bio: this.state.bio,
      id: this.props.match.params.bandId,
    }
    this.props.onUpdateBand(band)
  }

  handleRowClick(row) {
    history.push(`/testUser/bands/testBand/events/${row.id}/details`);
  }

  handleRowMenuItemClick(doc, action, event) {
    event.stopPropagation();
  }

  toggleCreateBandEventModal() {
    this.setState(prevState => ({
      showCreateBandEventModal: !prevState.showCreateBandEventModal
    }));
  }

  onCreateEventSubmit() {
    console.log('Event submitted');
    this.toggleCreateBandEventModal();
  }

  onCreateEventCancel() {
    this.toggleCreateBandEventModal();
  }

  onCreateEventSuccess() {
    console.log('Show successfully created');
  }

  onCreateEventError(err) {
    console.log('An error occured:' + err);
  }

  onCancelStageplotUpload() {
    this.setState({showStageplotModal: false})
  }

  onCancelLogoUpload() {
    this.setState({showLogoModal: false})
  }

  onDeleteStagePlot() {
    Promise.resolve()
    .then(() => this.props.deleteStagePlot(this.state.selectedStagePlot, this.props.band.id))
    .then(() => {
      if (!this.props.uploading) {
        this.setState({showAlert: false})
      }
    })
  }

  onCancelDeleteStagePlot() {
    this.setState({showAlert: false})
  }

  onSubmitDeleteStagePlot() {
    this.setState({showAlert: false})
  }

  renderEventCard(doc, index) {

    let statusColorClass = '';
    switch(doc.status) {
      case 'past':
        statusColorClass = 'clr-red';
        break;
      default:
        statusColorClass = 'clr-purple';
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
        className="card__link card__link__list"
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

  renderStagePlotCard(doc, index) {

    let card = (
        <div>
          <img src={ doc.url } alt={ doc.name } />
        </div>
    );

    return (
      <a
        href={doc.url}
        className="card__link card__link__stageplot card__link__list"
        key={ index }
      >
        <button className="card__delete" onClick={(event) => {
          event.preventDefault();
          Promise.resolve()
          .then(() => {
            this.setState({showAlert: true, selectedStagePlot: doc});
            console.log(doc);
          })
          .then(() => {
            this.props.onGetBand(this.props.band.id)
          })
          } }
        >
          <i className="material-icons">close</i>
        </button>
        <div className="card card__stageplot"
          key={ doc.id }
          onClick={ this.handleRowClick.bind(this, doc) }
        >
          { card }
        </div>
      </a>
    );
  }

  renderEventPreview() {
    const { events } = this.props;
      if(events && Object.keys(events).length > 0 && events.constructor === Object) {

        let rows = Object.keys(events).map((key) => {
          events[key].id = key;
          let index = events[key].date;
          if (events[key].status === 'upcoming') {
            return this.renderEventCard(events[key], index)
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

  renderStagePlots() {
    const { stageplots } = this.props.band;
      if(stageplots && Object.keys(stageplots).length > 0 && stageplots.constructor === Object) {
        let rows = Object.keys(stageplots).map((key) => {
          stageplots[key].id = key;
          return this.renderStagePlotCard(stageplots[key], key)
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
            <div>No stageplots</div>
          </div>
        );
      }
  }


  render() {

    const {
      user,
      band,
      match,
    } = this.props;


    let breadcrumbs = [
      { link: `/${match.params.userId}/dashboard`, name: user ? user.displayName : 'Dashboard' },
      { link: `/${match.params.userId}/bands`, name: 'Bands' },
      { link: `/${match.params.userId}/bands/${match.params.bandId}`, name: band ? band.name : 'Band Name' },
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
          buttonLabel="Add Event"
          buttonIcon="add"
          buttonOnClick={ this.toggleCreateBandEventModal }
        />
        <div className='page__content page__content--two-col'>
          <div className="page__content__container">
          <FileUploadModal
            show={ this.state.showStageplotModal }
            onCancel={ this.onCancelStageplotUpload }
            onUpload={this.props.uploadStagePlot}
            pathId={this.props.band.id}
            header="Upload Stageplot"
          />
          <FileUploadModal
            show={ this.state.showLogoModal }
            onCancel={ this.onCancelLogoUpload }
            onUpload={this.props.uploadBandLogo}
            pathId={this.props.band.id}
            header="Upload Logo"
          />
          <AlertModal
            show={ this.state.showAlert }
            title="Are you sure you want to delete this stageplot?"
            actionType="Delete"
            action={this.onDeleteStagePlot}
            onCancel={this.onCancelDeleteStagePlot}
            isLoading={ this.props.uploading }
          >
            <p>This action can not be undone</p>
          </AlertModal>
          <CreateBandEventModal
            show={ this.state.showCreateBandEventModal }
            onSubmit={ this.onCreateEventSubmit }
            onCancel={ this.onCreateEventCancel }
            onSuccess={ this.onCreateEventSuccess }
            onError={ this.onCreateEventError }
            // bandId={this.props.match.params.bandId}
            activeBand={this.props.band || ''}
            onCreateEvent={this.props.onCreateEvent}
          />
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3>Band Details</h3>
            <Input
              type="button-link"
              value="Edit"
              onClick={this.props.updateBandEdit}
              onSubmit={ this.onSubmitDeleteStagePlot }
              onCancel={ this.onCancelDeleteStagePlot }
            />
          </div>
          <div className="band__details__container">
          <div className="band__details__image__wrapper">
            <img
              src={band.logoUrl || "https://www.timeshighereducation.com/sites/default/files/byline_photos/anonymous-user-gravatar_0.png"}
              alt="Logo"
              className="band__logo"
              style={{marginBottom: 24}}
            />
            {/* <button className="modal__logo__link" href onClick={() => this.setState({showLogoModal: true})}>
              { band.logoUrl ? 'Change logo' : 'Upload logo' }
            </button> */}
            <Input
              type="button-link"
              value={ band.logoUrl ? 'Change logo' : 'Upload logo' }
              onClick={() => this.setState({showLogoModal: true})}
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
          <hr />
          <div className="slide-header">
            <h3>Upcoming Events</h3>
            <a href={`/${this.props.match.params.userId}/bands/${this.props.match.params.bandId}/events`}>View All</a>
          </div>
            { this.renderEventPreview() }
          <hr />
          <div className="slide-header">
            <h3>StagePlots</h3>
            {/* <button className="btn-icon" onClick={() => this.setState({showStageplotModal: true})}>
              <span className="btn-icon__text">Upload Stageplot</span>
              <i className="material-icons btn-icon__icon">add</i>
            </button> */}
            <Input
              type="button-link"
              value="Upload Stageplot"
              onClick={() => this.setState({showStageplotModal: true})}
            />
          </div>
            { this.renderStagePlots() }
          </div>
          <hr />
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
    bandEdit: state.bands.edit,
    user: state.auth.user,
    activeBandLogo: state.bands.activeBandLogoUrl,
    activeStagePlotUrl: state.bands.activeStagePlotUrl,
    isLoading: state.app.loading,
    uploading: state.bands.loading,
    notification: state.notification,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateBandEdit: updateBandEdit,
    onUpdateBand: updateBand,
    onGetBand: getBand,
    onClearEvent: actions.clearEvent,
    onGetEvent: actions.getEvent,
    onCreateEvent: actions.createEvent,
    onGetEventMany: actions.getEventMany,
    uploadBandLogo: uploadBandLogo,
    uploadStagePlot: uploadStagePlot,
    deleteStagePlot: deleteStagePlot,
    onDeleteBand: deleteBand,
    onRestoreBand: restoreBand,
    dismissNotification: dismissNotification,
    },
  dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(BandDashboard);