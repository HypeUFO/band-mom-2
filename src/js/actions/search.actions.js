import { database } from '../config/fire';
import ActionTypes from '../constants/action_types';

export function searchUsers(input) {
  return dispatch => {
    dispatch(searchUsersRequestedAction());
    console.log(input)
    database.ref('users').once('value', snap => {
      let users = {};
      Object.keys(snap.val()).map(key => {
        let userName = snap.val()[key].displayName.toLowerCase();
        if (userName.indexOf(input.toLowerCase()) !== -1 && input !== '') {
          return users[key] = snap.val()[key];
        } return null;
      });
      console.log(users)
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