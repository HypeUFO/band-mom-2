import ActionTypes from '../constants/action_types';
import { database, auth } from '../config/fire';

export function createUser(user) {
  console.log(database.ref().child('users'))
  return dispatch => {
    dispatch(createUserRequestedAction());
    return database.ref().child('users').push().set(user)
    .then(() => {
      dispatch(createUserFulfilledAction());
    })
    .catch((err) => {
      console.log(err);
      dispatch(createUserRejectedAction(err));
    });
  }
}

function createUserRequestedAction() {
  return {
    type: ActionTypes.CreateUserRequested
  };
}

function createUserRejectedAction(error) {
  return {
    type: ActionTypes.CreateUserRejected,
    error
  }
}

function createUserFulfilledAction(user) {
  return {
    type: ActionTypes.CreateUserFulfilled,
    user
  };
}

export function getUser(user) {
  return dispatch => {
    Promise.resolve()
    .then(() => {
      return dispatch(getUserRequestedAction());
    })
    .then(() => {
      return dispatch(getUserFulfilledAction(user))
    })
    .catch((err) => {
      dispatch(getUserRejectedAction(err));
    });
  }
}


function getUserRequestedAction() {
  return {
    type: ActionTypes.GetUserRequested
  };
}

function getUserRejectedAction(error) {
  return {
    type: ActionTypes.GetUserRejected,
    error,
  }
}

function getUserFulfilledAction(user) {
  return {
    type: ActionTypes.GetUserFulfilled,
    user,
    authenticated: !!user,
  };
}




export function signOut() {
  return dispatch => {
    return auth.signOut()
      .then(() => dispatch(signOutSuccess()))
      .catch(err => dispatch(signOutError(err)));
  };
}


function signOutSuccess() {
  return {
    type: ActionTypes.SIGN_OUT_SUCCESS
  };
}

function signOutError(err) {
  return {
    type: ActionTypes.SIGN_OUT_ERROR,
    err
  };
}

