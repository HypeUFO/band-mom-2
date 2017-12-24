import ActionTypes from '../constants/action_types';
import { database } from '../config/fire';

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

    // database.ref('/').once('value', snap => {
    //   const user = snap.val().user;
    //   console.log(user);
      //  return dispatch(getUserFulfilledAction(user))
    // })
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
    user
  };
}
