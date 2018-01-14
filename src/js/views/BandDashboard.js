import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import moment from 'moment';
import { database } from '../config/fire'
import * as actions from '../actions/event.actions';
import {
  getBand,
  updateBand,
  updateBandEdit,
  uploadBandLogo,
  uploadStagePlot,
  deleteBand,
  deleteStagePlot,
  leaveBand,
} from '../actions/band.actions';
import { dismissNotification } from '../actions/notification.actions';
import Drawer from '../components/Global/Drawer';
import Loader from '../components/Global/Loader';
import Subheader from '../components/Global/Subheader';
import CreateBandEventModal from '../modals/CreateBandEventModal';
import BandEditForm from '../components/Global/Forms/BandEditForm';
import Carousel from '../components/Carousel';
import Input from '../components/Global/Input';
import history from '../history';
import FileUploadModal from '../modals/FileUploadModal';
import AlertModal from '../modals/AlertModal';


const initialState = {
  showCreateBandEventModal: false,
  showDeleteStagePlotAlert: false,
  showDeleteBandAlert: false,
  showLeaveBandAlert: false,
  showShareModal: false,
  selected: '',
  showStageplotModal: false,
};

class BandDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.toggleCreateBandEventModal = this.toggleCreateBandEventModal.bind(this);
    this.onCreateEventSubmit = this.onCreateEventSubmit.bind(this);
    this.onCreateEventCancel = this.onCreateEventCancel.bind(this);
    this.onCancelStageplotUpload = this.onCancelStageplotUpload.bind(this);
    this.onCancelLogoUpload = this.onCancelLogoUpload.bind(this);
    this.onDeleteBand = this.onDeleteBand.bind(this);
    this.onLeaveBand = this.onLeaveBand.bind(this);
    this.onCancelAlert = this.onCancelAlert.bind(this);
    this.onDeleteStagePlot = this.onDeleteStagePlot.bind(this);
  }

  componentWillMount() {
    Promise.resolve()
    .then(() => {
      this.props.onGetBand(this.props.match.params.bandId)
    })
    .catch((err) => console.log(err));

    database.ref(`events`).on('value', () => {
      this.props.onGetEventMany((this.props.match.params.bandId))
    })
    database.ref(`groups/${this.props.match.params.bandId}`).on('value', () => {
        this.props.onGetBand(this.props.match.params.bandId)
      })
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
        this.setState({showDeleteStagePlotAlert: false})
      }
    })
  }

  onCancelAlert() {
    this.setState({
      showDeleteStagePlotAlert: false,
      showDeleteBandAlert: false,
      showLeaveBandAlert: false,
      showStageplotModal: false,
      showLogoModal: false
    })
  }

  onSubmitDeleteStagePlot() {
    this.setState({showDeleteStagePlotAlert: false})
  }

  onDeleteBand() {
    Promise.resolve()
    .then(() => this.props.deleteBand(this.props.band, this.props.user))
    .then(() => {
      this.props.updateBandEdit()
      this.props.history.push(`/${this.props.user.id}/bands`)
    })
    .catch(err => console.log(err))
  }

  onLeaveBand() {
    Promise.resolve()
    .then(() => this.props.leaveBand(this.props.band, this.props.user))
    .then(() => {
      this.props.updateBandEdit()
      this.props.history.push(`/${this.props.user.id}/bands`)
    })
    .catch(err => console.log(err))
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
        key={ doc.id }
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
            this.setState({showDeleteStagePlotAlert: true, selectedStagePlot: doc});
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
    let formBottomClasses = classNames('form__bottom', { 'form__bottom--hidden': !this.props.bandEdit });

    let removeActions = classNames('band__details__remove-actions', { 'band__details__remove-actions--hidden': !this.props.bandEdit });

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
            uploader={this.props.band}
            header="Upload Stageplot"
            isLoading={ this.props.uploading }
            error={this.props.uploadError}
          />
          <FileUploadModal
            show={ this.state.showLogoModal }
            onCancel={ this.onCancelLogoUpload }
            onUpload={this.props.uploadBandLogo}
            uploader={this.props.band}
            header="Upload Logo"
            isLoading={ this.props.uploading }
            error={this.props.uploadError}
          />
          <AlertModal
            show={ this.state.showDeleteStagePlotAlert }
            title="Are you sure you want to delete this stageplot?"
            actionType="Delete"
            action={this.onDeleteStagePlot}
            onCancel={this.onCancelAlert}
            isLoading={ this.props.uploading }
          >
            <p>This action can not be undone</p>
          </AlertModal>

          <AlertModal
            show={ this.state.showDeleteBandAlert }
            title="Are you sure you want to delete this band?"
            actionType="Delete"
            action={this.onDeleteBand}
            onCancel={this.onCancelAlert}
            // isLoading={ this.props.uploading }
          >
            <p>This action can not be undone</p>
          </AlertModal>

          <AlertModal
            show={ this.state.showLeaveBandAlert }
            title="Are you sure you want to leave this band?"
            actionType="Leave"
            action={this.onLeaveBand}
            onCancel={this.onCancelAlert}
            // isLoading={ this.props.uploading }
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
          <div className={ removeActions }>
            <Input
              type="button-danger"
              value="DELETE BAND"
              onClick={(event) => {
                this.setState({showDeleteBandAlert: true});
              } }
            />

            <Input
              type="button-danger"
              value="LEAVE BAND"
              onClick={(event) => {
                this.setState({showLeaveBandAlert: true});
              } }
            />

          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3>Band Details</h3>
            <Input
              type="button-link"
              value="Edit"
              onClick={this.props.updateBandEdit}
              onSubmit={ this.onSubmitDeleteStagePlot }
              onCancel={ this.onCancelAlert }
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
            <Input
              type="button-link"
              value={ band.logoUrl ? 'Change logo' : 'Upload logo' }
              onClick={() => this.setState({showLogoModal: true})}
            />
          </div>
          <BandEditForm bandEdit={this.props.bandEdit} />
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
    uploadError: state.bands.error,
    notification: state.notification,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateBandEdit: updateBandEdit,
    deleteBand: deleteBand,
    leaveBand: leaveBand,
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
    dismissNotification: dismissNotification,
    },
  dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(BandDashboard);