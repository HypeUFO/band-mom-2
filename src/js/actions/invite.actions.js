import ActionTypes from '../constants/action_types';
import database from '../config/fire';

export function getGig() {
  // return {type: ActionTypes.GetGigFulfilled,};
  return dispatch => {
    dispatch(getGigRequestedAction());
    database.ref('/').once('value', snap => {
      const gigs = snap.val();
       return dispatch(getGigFulfilledAction(gigs))
    })
    // .then(data => {
    //   console.log(data);
    // })
    .catch((error) => {
      console.log(error);
      dispatch(getGigRejectedAction());
    });
  }
}

function getGigRequestedAction() {
  return {
    type: ActionTypes.GetGigRequested
  };
}

function getGigRejectedAction() {
  return {
    type: ActionTypes.GetGigRejected
  }
}

function getGigFulfilledAction(gigs) {
  return {
    type: ActionTypes.GetGigFulfilled,
    gigs
  };
}