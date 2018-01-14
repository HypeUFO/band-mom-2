import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/auth.actions';
import { sendGroupInvite } from '../actions/band.actions';
import { getActiveProfile, clearActiveProfile } from '../actions/search.actions';
import { dismissNotification } from '../actions/notification.actions';
import Drawer from '../components/Global/Drawer';
import Loader from '../components/Global/Loader';
import Subheader from '../components/Global/Subheader';



import instrumentList from '../constants/instrument_list';

import Form from '../components/Global/Form';

import Input from '../components/Global/Input';
import moment from 'moment';


import classNames from 'classnames';

import { database } from '../config/fire'
import FileUploadModal from '../modals/FileUploadModal';
import AlertModal from '../modals/AlertModal';


const initialState = {
  showAlert: false,
  showInviteModal: false,
  showImageModal: false,
  displayName: '',
  location: '',
  about: '',
  imageUrl: '',
  instruments: {},
};

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
    this.handleBandSelect = this.handleBandSelect.bind(this);

    this.inviteUser = this.inviteUser.bind(this);
    this.inviteUserCancel = this.inviteUserCancel.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.uploadImageCancel = this.uploadImageCancel.bind(this);

    this.onUpdateUserEdit = this.onUpdateUserEdit.bind(this)
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

  componentDidMount() {
    Promise.resolve()
    .then(() => this.props.clearActiveProfile())
    .then(() => this.setState(initialState))
    .then(() => {
      return database.ref().on("value", () => this.props.onGetActiveProfile(this.props.match.params.userId))
    })
    .then(() => {
      const { activeProfile } = this.props;
      if (this.props.userEdit) {
        this.props.updateUserEdit();
      }
      return (
          this.setState({
          displayName: activeProfile.displayName || '',
          location: activeProfile.location || '',
          about: activeProfile.about || '',
          imageUrl: activeProfile.imageUrl || '',
          instruments: activeProfile.instruments || {},
        })
      )
    })
    .catch((err) => console.log(err));
  }

  componentWillUnmount() {
    this.props.clearActiveProfile();
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
  }

  handleBandSelect(event) {
    const band = this.props.bands[event.target.value.split('/')[1]];
    console.log(band);
    this.setState({
      band
    });
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
    this.setState({disabled: true})
    this.props.updateUserEdit();
    this.props.onGetActiveProfile(this.props.match.params.userId);
  }

  onSuccess() {
    this.props.updateUserEdit();
    this.props.onGetActiveProfile(this.props.match.params.userId);
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
      imageUrl: this.state.imageUrl || '',
      instruments: this.state.instruments || {},
      id: this.props.activeProfile.id,
    }
    this.props.onUpdateUser(user)
  }

  onUpdateUserEdit() {
    Promise.resolve()
    .then(() => {
      const { activeProfile } = this.props;
      this.setState({
        displayName: activeProfile.displayName || '',
        location: activeProfile.location || '',
        about: activeProfile.about || '',
        imageUrl: activeProfile.imageUrl || '',
        instruments: activeProfile.instruments || '',
      })
    })
    .then(() => this.props.updateUserEdit())
  }

  inviteUser() {
    Promise.resolve()
    .then(() => {
      return this.props.sendGroupInvite(this.state.band, this.props.activeProfile.id, this.props.user);
    })
    .then(() => this.setState({showInviteModal: false}))
    .catch(err => console.log(err));
  }

  inviteUserCancel() {
    this.setState({showInviteModal: false});
  }

  uploadImage() {
    this.props.uploadProfileImage()
  }

  uploadImageCancel() {
    this.setState({showImageModal: false});
  }

  renderCheckboxes(list) {
    return (
      list.map((item, index) => {
        return (
          <Input
            type="checkbox"
            name={item.value}
            label={item.label}
            key={index}
            disabled={ !this.props.userEdit }
            onChange={ this.handleCheckboxChange }
            isChecked={ this.state.instruments[item.label] || (this.props.activeProfile.instruments && this.props.activeProfile.instruments[item.label]) ? true : false }
          />
        );
      })
    );
  }

  renderInstrumentList(list) {
    if (list) {
      let listItems = []
      Object.keys(list).map(key => {
        if (list[key]) {
          listItems.push(
            <li key={key}>
              { key }
            </li>
          );
        }
      })
      return listItems;
    }
  }


  render() {

    const {
      user,
      activeProfile,
      userEdit,
      band,
      bands,
      match,
    } = this.props;


    if (activeProfile) {
      let breadcrumbs;
      if (user.id === activeProfile.id ) {
        breadcrumbs = [
          { link: `/${match.params.userId}/dashboard`, name: user.displayName || user.email },
          { link: `/${match.params.userId}/profile`, name: 'Profile' },
        ];
      } else {
        breadcrumbs = [
          { link: `/${user.id}/dashboard`, name: user.displayName || user.email },
          { link: `/${match.params.userId}/profile`, name: `${activeProfile.displayName || activeProfile.email}'s Profile` },
        ];
      }

      let formBottomClasses = classNames('form__bottom', { 'form__bottom--hidden': !this.props.userEdit });
      let checkboxGroupClasses = classNames('checkbox__group', { 'checkbox__group--disabled': !this.props.userEdit });

      let bandList = [];
      if (this.props.bands) {
        Object.keys(bands).map(key => {
          let addBandInfo = {
            label: bands[key].name,
            value: bands[key].name + '/' + bands[key].id,
          }
          return bandList.push(addBandInfo);
        })
      }
      bandList.unshift({label: 'Select Band', value: ''})

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
            buttonHide={ user.id === activeProfile.id }
            buttonLabel="Invite to Group"
            // buttonIcon="add"
            buttonOnClick={ () => this.setState({showInviteModal: true}) }
          />
          <div className='page__content page__content--two-col'>
            <div className="page__content__container">
            <FileUploadModal
              show={ this.state.showImageModal }
              onCancel={ this.uploadImageCancel }
              onUpload={ this.props.uploadProfileImage }
              uploader={this.props.activeProfile}
              header="Upload Profile Picture"
              isLoading={ this.props.isLoading }
              error={this.props.uploadError}
            />
            <AlertModal
              show={ this.state.showInviteModal }
              title={`Invite ${activeProfile.displayName} to band`}
              actionType="Invite"
              action={this.inviteUser}
              onCancel={this.inviteUserCancel}
              // isLoading={ this.props.uploading }
            >
              <Input type="select"
                  name="band"
                  placeholder="Band"
                  options={ bandList }
                  // value={ this.state.band }
                  onChange={ this.handleBandSelect }
                  // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                />
            </AlertModal>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3>{activeProfile.displayName}</h3>
              { user.id === this.props.match.params.userId
              ? <Input
                type="button-link"
                value="Edit"
                // onClick={this.props.updateUserEdit}
                onClick={this.onUpdateUserEdit}
                onSubmit={ this.onSubmitDeleteStagePlot }
                onCancel={ this.onCancelDeleteStagePlot }
              />
              : null
              }
            </div>
            <div className="user__profile__container">
              <div className="user__profile__image__wrapper">
                <img
                  src={activeProfile.imageUrl || "https://www.timeshighereducation.com/sites/default/files/byline_photos/anonymous-user-gravatar_0.png"}
                  alt="profile pic"
                  className="user__logo"
                  style={{marginBottom: 24}}
                />
                <Input
                  type="button-link"
                  style={{fontSize: '0.8rem'}}
                  value={ activeProfile.imageUrl ? 'Change Profile Picture' : 'Upload Profile Picture' }
                  onClick={() => this.setState({showImageModal: true})}
                />
              </div>
              <Form
                // className="form__container"
                className="user__profile__form"
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
                        value={ this.props.userEdit ? this.state.displayName : activeProfile.displayName }
                        onChange={ this.handleInputChange }
                        validation={{ isLength: { min: 3, max: 30 }, isAlphanumeric: { blacklist: [' '] } }}
                      />
                      <Input type="text"
                        name="location"
                        placeholder="Location"
                        label="Location"
                        // disabled={ !this.props.userEdit }
                        disabled={ !userEdit }
                        value={ this.props.userEdit ? this.state.location : activeProfile.location }
                        onChange={ this.handleInputChange }
                        validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                      />
                    </div>
                    <div className="form__row">
                      <Input type="textarea"
                        name="about"
                        placeholder="About"
                        label="About"
                        // disabled={ !this.props.userEdit }
                        disabled={ !userEdit }
                        value={ this.props.userEdit ? this.state.about : activeProfile.about }
                        onChange={ this.handleInputChange }
                        // validation={{ isLength: { min: 3, max: 80 }, isAlphanumeric: { blacklist: [' '] } }}
                      />
                    </div>
                    <div className="form__column">
                      <label className="input__label">Instruments</label>
                      <div className="form__row">
                        <div className={checkboxGroupClasses}>
                          { this.props.userEdit
                            ? this.renderCheckboxes(instrumentList)
                            : <ul>{this.renderInstrumentList(this.props.activeProfile.instruments)}</ul>
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
            <h3>SoundCloud Widgets to come...</h3>
          </div>
          <hr />
        </div>
      </div>
      );
    } else {
      return <Loader />
    }
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    uploadError: state.auth.error,
    activeProfile: state.search.activeProfile,
    userEdit: state.auth.edit,
    isLoading: state.app.loading,
    bands: state.bands.bands,
    notification: state.notification,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUserEdit: actions.updateUserEdit,
    onUpdateUser: actions.updateUser,
    onGetUser: actions.getUser,
    onGetActiveProfile: getActiveProfile,
    clearActiveProfile: clearActiveProfile,
    sendGroupInvite: sendGroupInvite,
    uploadProfileImage: actions.uploadProfileImage,
    dismissNotification: dismissNotification,
    },
  dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(BandDashboard);