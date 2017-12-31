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

export function getUser(firebaseUser) {
  return dispatch => {
    getUserRequestedAction();
    database.ref('/users/'+firebaseUser.uid).once('value', snap => {
      const user = snap.val();
      return dispatch(getUserFulfilledAction(user))
    })
    .catch((err) => {
      dispatch(getUserRejectedAction(err));
    });

  //   Promise.resolve()
  //   .then(() => {
  //     return dispatch(getUserRequestedAction());
  //   })
  //   .then(() => {
  //     return dispatch(getUserFulfilledAction(user))
  //   })
  //   .catch((err) => {
  //     dispatch(getUserRejectedAction(err));
  //   });
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


