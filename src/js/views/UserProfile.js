import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/auth.actions';
import {
  getBand,
  updateUser,
  updateUserEdit,
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



import instruments from '../constants/instrument_list';

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
  showAlert: false,
  displayName: '',
  location: '',
  about: '',
  profilePic: '',
  // id: '',
  instruments: {},
};

// const userEdit = true;

class BandDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    // this.db = database.ref().child('bands');
    this.id = window.location.pathname.split('/')[3];

    this.renderCheckboxes = this.renderCheckboxes.bind(this);
    this.renderInstrumentList = this.renderInstrumentList.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    // this.toggleCreateEventModal = this.toggleCreateEventModal.bind(this);
    // this.onCreateEventSubmit = this.onCreateEventSubmit.bind(this);
    // this.onCreateEventCancel = this.onCreateEventCancel.bind(this);
    // this.onCancelStageplotUpload = this.onCancelStageplotUpload.bind(this);
    // this.onCancelLogoUpload = this.onCancelLogoUpload.bind(this);
    // this.onCancel = this.onCancel.bind(this);
    // this.handleInputChange = this.handleInputChange.bind(this);
    // this.onDeleteEventSuccess = this.onDeleteEventSuccess.bind(this);
    // this.onDeleteEventError = this.onDeleteEventError.bind(this);
    // this.deleteEvent = this.deleteEvent.bind(this);
    // this.restoreEvent = this.restoreEvent.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    // this.onCancelDeleteStagePlot = this.onCancelDeleteStagePlot.bind(this);
    // this.onDeleteStagePlot = this.onDeleteStagePlot.bind(this);

    // this.handleAsyncUpdateButtonClick = this.handleAsyncUpdateButtonClick.bind(this);

    // this.handleFormEdit = this.handleFormEdit.bind(this);

  }

  componentWillMount() {
    Promise.resolve()
    .then(() => {
      // this.props.onGetBand(this.id)
    })
    .then(() => {
      // console.log(this.props.band);
      this.setState({
        // disabled: !!this.props.bandEdit,
        displayName: this.props.user.displayName || '',
        location: this.props.user.location || '',
        about: this.props.user.about || '',
        profilePic: this.props.user.profilePic || '',
        instruments: this.props.user.instruments || '',
      })
    })
    .catch((err) => console.log(err));

    database.ref(`users/${this.props.match.params.userId}`).on('value', (snap) => {
      // this.props.onGetUser(this.props.match.params.userId)
      console.log(snap.val())
    })
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCheckboxChange(event) {
    const name = [event.target.name];
    const value = event.target.checked

    this.setState(prevState => ({
      instruments: {
          ...prevState.instruments,
          [name]: value,
      }
    }))
    console.log(this.state);
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
    this.props.updateUserEdit();
  }

  onSuccess() {
    this.props.updateUserEdit();
    // this.props.onGetUser(this.props.user.id);
  }

  onError(err) {
    console.log('An error occurred: ' + err)
  }

  handleAsyncUpdateButtonClick() {
    Promise.resolve()
    .then(this.updateUser())
    .then(() => this.onSuccess())
    .catch(err => this.onError(err));
  }

  updateUser() {
    const user = {
      displayName: this.state.displayName,
      location: this.state.location,
      about: this.state.about,
      profilePic: this.state.profilePic || '',
      instruments: this.state.instruments || {},
      id: this.props.user.id,
    }
    this.props.onUpdateUser(user)
  }

  renderCheckboxes(list) {
    return (
      list.map(item => {
        return (
          <Input
            type="checkbox"
            name={item.value}
            label={item.label}
            // disabled={ !this.props.userEdit }
            disabled={ !this.props.userEdit }
            onChange={ this.handleCheckboxChange }
            isChecked={ this.state.instruments[item.label] ? true : false }
          />
        );
      })
    );
  }

  renderInstrumentList(list) {
    let listItems = []
    Object.keys(list).map(key => {
      console.log(key);
      if (list[key]) {
        listItems.push(
          <li>
            { key }
          </li>
        );
      }
    })
    return listItems;
  }


  render() {

    const {
      user,
      userEdit,
      band
    } = this.props;


    let breadcrumbs = [
      { link: null, name: user ? user.displayName || user.email : '' },
    ];

    if (user) {
    let formBottomClasses = classNames('form__bottom', { 'form__bottom--hidden': !this.props.userEdit });

    let checkboxGroupClasses = classNames('checkbox__group', { 'checkbox__group--disabled': !this.props.userEdit });

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
          <FileUploadModal
            show={ this.state.showLogoModal }
            onCancel={ this.onCancelLogoUpload }
            onUpload={this.props.uploadBandLogo}
            pathId={this.props.user.id}
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
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3>Band Details</h3>
            <Input
              type="button-link"
              value="Edit"
              onClick={this.props.updateUserEdit}
              onSubmit={ this.onSubmitDeleteStagePlot }
              onCancel={ this.onCancelDeleteStagePlot }
            />
          </div>
          <div className="band__details__container">
          <div className="band__details__image__wrapper">
            <img
              src={user.logoUrl || "https://www.timeshighereducation.com/sites/default/files/byline_photos/anonymous-user-gravatar_0.png"}
              alt="Logo"
              className="user__logo"
              style={{marginBottom: 24}}
            />
            {/* <button className="modal__logo__link" href onClick={() => this.setState({showLogoModal: true})}>
              { user.logoUrl ? 'Change logo' : 'Upload logo' }
            </button> */}
            <Input
              type="button-link"
              value={ user.logoUrl ? 'Change logo' : 'Upload logo' }
              onClick={() => this.setState({showLogoModal: true})}
            />
          </div>
          <Form
            // className="form__container"
            className="user__details__form"
            id="user-details__form"
            onSubmit={ this.onSubmit }
            onCancel={ this.onCancel }
            // disabled={ !this.props.userEdit }
            disabled={ !userEdit }
            ref="form"
            // error={ createError || uploadError }
          >
            <div className="form__middle form__middle__user-dashboard">
              <div className="form__column">
                <div className="form__row">
                  <Input type="text"
                    name="displayName"
                    placeholder="Display Name"
                    label="Display Name"
                    // disabled={ !this.props.userEdit }
                    disabled={ !userEdit }
                    value={ this.props.userEdit ? this.state.displayName : user.displayName }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  <Input type="text"
                    name="location"
                    placeholder="Location"
                    label="Location"
                    // disabled={ !this.props.userEdit }
                    disabled={ !userEdit }
                    value={ this.props.userEdit ? this.state.location : user.location }
                    onChange={ this.handleInputChange }
                    validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                  </div>
                  <div className="form__row">
                  {/* checkbox */}
                </div>
                <div className="form__row">
                  <Input type="textarea"
                    name="about"
                    placeholder="About"
                    label="About"
                    // disabled={ !this.props.userEdit }
                    disabled={ !userEdit }
                    value={ this.props.userEdit ? this.state.about : user.about }
                    onChange={ this.handleInputChange }
                    // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                  />
                </div>
                <div className="form__column">
                  <label className="input__label">Instruments</label>
                  <div className="form__row">
                    <div className={checkboxGroupClasses}>
                      { this.props.userEdit
                        ? this.renderCheckboxes(instruments)
                        : <ul>{this.renderInstrumentList(this.state.instruments)}</ul>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={ formBottomClasses }>
              <Input type="button-thin-cancel" value="Cancel" />
              <Input type="button-thin-submit" value="Save" />
            </div>
          </Form>
          </div>
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
    user: state.app.user,
    userEdit: state.app.edit,
    isLoading: state.app.loading,
    uploading: state.bands.loading,
    notification: state.notification,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUserEdit: actions.updateUserEdit,
    onUpdateUser: actions.updateUser,
    onGetUser: actions.getUser,
    // onClearEvent: actions.clearEvent,
    // onGetEvent: actions.getEvent,
    // onGetEventMany: actions.getEventMany,
    // uploadBandLogo: uploadBandLogo,
    // uploadStagePlot: uploadStagePlot,
    // deleteStagePlot: deleteStagePlot,
    // onDeleteBand: deleteBand,
    // onRestoreBand: restoreBand,
    dismissNotification: dismissNotification,
    },
  dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(BandDashboard);