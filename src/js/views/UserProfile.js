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
import UserEditForm from '../components/Global/Forms/UserEditForm';
import Input from '../components/Global/Input';
import { database } from '../config/fire'
import FileUploadModal from '../modals/FileUploadModal';
import AlertModal from '../modals/AlertModal';


const initialState = {
  showAlert: false,
  showInviteModal: false,
  showImageModal: false,
};

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.inviteUser = this.inviteUser.bind(this);
    this.inviteUserCancel = this.inviteUserCancel.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.uploadImageCancel = this.uploadImageCancel.bind(this);
    this.onUpdateUserEdit = this.onUpdateUserEdit.bind(this)
  }

  componentDidMount() {
    Promise.resolve()
    .then(() => this.props.clearActiveProfile())
    .then(() => {
      return database.ref().on("value", () => this.props.onGetActiveProfile(this.props.match.params.userId))
    })
    .then(() => {
      if (this.props.userEdit) {
        this.props.updateUserEdit();
      }
    })
    .catch((err) => console.log(err));
  }

  componentWillUnmount() {
    this.props.clearActiveProfile();
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
            buttonIcon="add"
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
              <UserEditForm
                activeProfile={this.props.activeProfile}
                user={this.props.user}
                userEdit={this.props.userEdit}
                updateUserEdit={this.props.updateUserEdit}
                onUpdateUser={this.props.onUpdateUser}
                onGetActiveProfile={this.props.onGetActiveProfile}
              />
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


export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);