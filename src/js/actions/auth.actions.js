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
