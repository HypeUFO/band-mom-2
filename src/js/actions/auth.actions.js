import ActionTypes from '../constants/action_types';
import { database, auth } from '../config/fire';

export function createUser(user) {
  console.log('Creating user: ' + user);
  return dispatch => {
    dispatch(createUserRequestedAction());
    return database.ref(`/users/${user.id}`).set(user)
    // return database.ref().child('users').push().set(user)
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
    type: ActionTypes.CREATE_USER_REQUESTED
  };
}

function createUserRejectedAction(error) {
  return {
    type: ActionTypes.CREATE_USER_REJECTED,
    error
  }
}

function createUserFulfilledAction(user) {
  return {
    type: ActionTypes.CREATE_USER_FULFILLED,
    user
  };
}

export function getUser(user) {
  return dispatch => {
    dispatch(getUserRequestedAction());
    database.ref(`/users/${user.uid}`).once('value', snap => {
      const user = snap.val();
      return dispatch(getUserFulfilledAction(user))
    })
    .catch((err) => {
      dispatch(getUserRejectedAction(err));
    });
  }
}


function getUserRequestedAction() {
  return {
    type: ActionTypes.GET_USER_REQUESTED
  };
}

function getUserRejectedAction(error) {
  return {
    type: ActionTypes.GET_USER_REJECTED,
    error,
  }
}

function getUserFulfilledAction(user) {
  return {
    type: ActionTypes.GET_USER_FULFILLED,
    user,
    authenticated: !!user,
  };
}

export function signIn(params) {
  return dispatch => {
    dispatch(signInRequested())
    return auth.signInWithEmailAndPassword(params.email, params.password)
    .then(() => dispatch(signInSuccess()))
    .catch(err => dispatch(signInError(err)));
  };
}

function signInRequested() {
  return {
    type: ActionTypes.SIGN_IN_REQUESTED,
  };
}

function signInSuccess() {
  return {
    type: ActionTypes.SIGN_IN_SUCCESS,
  };
}

function signInError(error) {
  return {
    type: ActionTypes.SIGN_IN_ERROR,
    error
  };
}


export function signOut() {
  return dispatch => {
    dispatch(signOutRequested())
    return auth.signOut()
      .then(() => dispatch(signOutSuccess()))
      .catch(err => dispatch(signOutError(err)));
  };
}

function signOutRequested() {
  return {
    type: ActionTypes.SIGN_OUT_REQUESTED
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

export function setNextRoute(route) {
  return dispatch => {
    Promise.resolve()
    .then(() => {
      return dispatch(setNextRouteRequestedAction())
    })
    .then(() => {
      return dispatch(setNextRouteFulfilledAction(route))
    })
    .catch(err => dispatch(setNextRouteErrorAction(err)));
  };
}


function setNextRouteRequestedAction() {
  return {
    type: ActionTypes.SET_NEXT_ROUTE_REQUESTED,
  }
}

function setNextRouteFulfilledAction(nextRoute) {
  return {
    type: ActionTypes.SET_NEXT_ROUTE_FULFILLED,
    nextRoute: nextRoute,
  }
}

function setNextRouteErrorAction(error) {
  return {
    type: ActionTypes.SET_NEXT_ROUTE_ERROR,
    error,
  }
}

export function resetPassword(email) {
  return console.log(`Resetting PW for ${email}`)
}

export function updateUserEdit() {
  return dispatch => {
    Promise.resolve()
    .then(() => dispatch(updateUserEditRequestedAction()))
    .then(() => {
      dispatch(updateUserEditFulfilledAction());
    })
    .catch((err) => {
      dispatch(updateUserEditRejectedAction(err));
    });
  }
}

function updateUserEditRequestedAction() {
  return {
    type: ActionTypes.UPDATE_USER_EDIT_REQUESTED
  }
}

function updateUserEditFulfilledAction() {
  return {
    type: ActionTypes.UPDATE_USER_EDIT_FULFILLED
  };
}

function updateUserEditRejectedAction(error) {
  return {
    type: ActionTypes.UPDATE_USER_EDIT_REJECTED,
    error
  }
}

export function updateUser(user) {
  console.log(user);
  return dispatch => {
    dispatch(updateUserRequestedAction());
    database.ref().child('users/' + user.id).update(user)
    .then(() => {
      database.ref(`/users/${user.id}`).once('value', snap => {
        const updatedUser = snap.val();
        console.log(updatedUser);
        return dispatch(updateUserFulfilledAction(updatedUser))
      })
      // dispatch(updateUserFulfilledAction());
    })
    .catch((error) => {
      console.log(error);
      dispatch(updateUserRejectedAction());
    });
  }
}

function updateUserRequestedAction() {
  return {
    type: ActionTypes.UPDATE_USER_REQUESTED
  };
}

function updateUserRejectedAction() {
  return {
    type: ActionTypes.UPDATE_USER_REJECTED
  }
}

function updateUserFulfilledAction(user) {
  return {
    type: ActionTypes.UPDATE_USER_FULFILLED,
    user
  };
}


export function getActiveProfile(userId) {
  console.log(userId);
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
      console.log(error);
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
      console.log(error);
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