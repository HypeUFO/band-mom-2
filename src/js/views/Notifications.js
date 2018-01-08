import React, { Component } from 'react';
import classNames from 'classnames';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/auth.actions';
import { acceptGroupInvite, declineGroupInvite } from '../actions/band.actions';


import Drawer from '../components/Global/Drawer';
import Subheader from '../components/Global/Subheader';
import Form from '../components/Global/Form';
import Input from '../components/Global/Input';
import Card from '../components/Global/Card/Card';
import CardSection from '../components/Global/Card/CardSection';

const notificationList = {
  1: {message: 'Someone has invited you to join their group', action: 'acceptGroupInvite', actionType: 'Confirm', actionId: '-L2HuFLpyDFfJVtfUMnA'},
  2: {message: 'Something has been updated'},
  3: {message: 'Something has been created'},
}

class Notifications extends Component {
  constructor(props) {
    super(props);

    this.renderNotifications = this.renderNotifications.bind(this);
  }

  renderNotifications() {

    return Object.keys(notificationList).map(key => {
      return (
        <Card className="card__notification" key={key}>
          <CardSection>
            <p className="notification__card__message">
              {notificationList[key].message}
            </p>
          </CardSection>
          <CardSection>
            <div className="form__row">
              <Input type="button-thin-cancel" value="Dismiss" onCancel={() => this.props.declineGroupInvite(notificationList[key].actionId, this.props.user.id)}/>
              { notificationList[key].action
                ? <Input
                    type="button-thin-button"
                    value={ notificationList[key].actionType }
                    onClick={() => this.props.acceptGroupInvite(notificationList[key].actionId, this.props.user.id)}
                  />
                : null }
            </div>
          </CardSection>
        </Card>
      )
    })
  }

  render() {

    // Subheader
    // let breadcrumbs = [
    //   { link:  `/${this.props.match.params.userId}/dashboard`, name: this.props.user.displayName ||  this.props.user.email},
    //   { link: `/${this.props.match.params.userId}/bands`, name: 'Bands' },
    // ];

    return (
      <div className='page__container'>
        <Drawer
          // userName={ userName }
          show={ true }
          className="drawer__sidebar"
          // toggle={ this.toggleDrawer }
        />
        {/* <Subheader breadcrumbs={ breadcrumbs }
          // buttonHide={ buttonHide }
          buttonLabel="Add Band"
          buttonIcon="add"
          buttonOnClick={ this.toggleCreateBandModal }
        /> */}
        <div className='page__content page__content--two-col'>
          <div className="page__content__container">
            <h1>Notifications</h1>
            <div className="card__list__container">
            {this.renderNotifications()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    activeProfile: state.search.activeProfile,
    userEdit: state.auth.edit,
    isLoading: state.app.loading,
    bands: state.bands.bands,
    uploading: state.bands.loading,
    notification: state.notification,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // updateUserEdit: actions.updateUserEdit,
    // onUpdateUser: actions.updateUser,
    // onGetUser: actions.getUser,
    // onGetActiveProfile: actions.getActiveProfile,
    // clearActiveProfile: actions.clearActiveProfile,
    acceptGroupInvite: acceptGroupInvite,
    declineGroupInvite: declineGroupInvite,
    // uploadProfileImage: actions.uploadProfileImage,
    // onClearEvent: actions.clearEvent,
    // onGetEvent: actions.getEvent,
    // onGetEventMany: actions.getEventMany,
    // uploadBandLogo: uploadBandLogo,
    // uploadStagePlot: uploadStagePlot,
    // deleteStagePlot: deleteStagePlot,
    // onDeleteBand: deleteBand,
    // onRestoreBand: restoreBand,
    // dismissNotification: dismissNotification,
    },
  dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Notifications);