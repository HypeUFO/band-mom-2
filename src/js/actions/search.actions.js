import { database } from '../config/fire';
import ActionTypes from '../constants/action_types';

export function searchUsers(input) {
  return dispatch => {
    dispatch(searchUsersRequestedAction());
    database.ref('users').once('value', snap => {
      let users = {};
      Object.keys(snap.val()).map(key => {
        let userName = snap.val()[key].displayName.toLowerCase();
        if (userName.indexOf(input.toLowerCase()) !== -1 && input !== '') {
          return users[key] = snap.val()[key];
        } return null;
      });
      return dispatch(searchUsersFulfilledAction(users))
    })
    .catch((err) => {
      dispatch(searchUsersRejectedAction(err));
    });
  }
}


function searchUsersRequestedAction() {
  return {
    type: ActionTypes.SEARCH_USERS_REQUESTED
  };
}

function searchUsersRejectedAction(error) {
  return {
    type: ActionTypes.SEARCH_USERS_REJECTED,
    error,
  }
}

function searchUsersFulfilledAction(users) {
  return {
    type: ActionTypes.SEARCH_USERS_FULFILLED,
    users,
  };
}

export function getActiveProfile(userId) {
  return dispatch => {
    Promise.resolve()
    .then(() => clearActiveProfile())
    .then(() => {
      dispatch(getActiveProfileRequestedAction());
      database.ref(`/users/${userId}`).once('value', snap => {
        const user = snap.val();
        console.log(user);
        return dispatch(getActiveProfileFulfilledAction(user))
      })
    })
    .catch((error) => {
      dispatch(getActiveProfileRejectedAction());
    });
  }
}

function getActiveProfileRequestedAction() {
  return {
    type: ActionTypes.GET_PROFILE_REQUESTED
  };
}

function getActiveProfileRejectedAction() {
  return {
    type: ActionTypes.GET_PROFILE_REJECTED
  }
}

function getActiveProfileFulfilledAction(activeProfile) {
  return {
    type: ActionTypes.GET_PROFILE_FULFILLED,
    activeProfile
  };
}

export function clearActiveProfile() {
  return dispatch => {
    Promise.resolve()
    .then(() => dispatch(clearActiveProfileRequestedAction()))
    .then(() => dispatch(clearActiveProfileFulfilledAction()))
    .catch((error) => {
      dispatch(clearActiveProfileRejectedAction());
  });
  }
}

function clearActiveProfileRequestedAction() {
  return {
    type: ActionTypes.CLEAR_PROFILE_REQUESTED
  };
}

function clearActiveProfileRejectedAction() {
  return {
    type: ActionTypes.CLEAR_PROFILE_REJECTED
  }
}

function clearActiveProfileFulfilledAction() {
  return {
    type: ActionTypes.CLEAR_PROFILE_FULFILLED,
  };
}
