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

export function createGig(gig) {
  // return {type: ActionTypes.createGigFulfilled,};
  return dispatch => {
    dispatch(createGigRequestedAction());
    return database.ref().child('gigs').push().set(gig)
    .then(data => {
      console.log(data);
      return createGigFulfilledAction();
    })
    .catch((error) => {
      console.log(error);
      dispatch(createGigRejectedAction());
    });
  }
}

function createGigRequestedAction() {
  return {
    type: ActionTypes.CreateGigRequested
  };
}

function createGigRejectedAction() {
  return {
    type: ActionTypes.CreateGigRejected
  }
}

function createGigFulfilledAction(gigs) {
  return {
    type: ActionTypes.CreateGigFulfilled,
    gigs
  };
}





export function deleteGig(gigId) {
  // return {type: ActionTypes.deleteGigFulfilled,};
  return dispatch => {
    dispatch(deleteGigRequestedAction());
    return database.child(gigId).remove()
    .then(data => {
      console.log(data);
      return deleteGigFulfilledAction();
    })
    .catch((error) => {
      console.log(error);
      dispatch(deleteGigRejectedAction());
    });
  }
}

function deleteGigRequestedAction() {
  return {
    type: ActionTypes.DeleteGigRequested
  };
}

function deleteGigRejectedAction() {
  return {
    type: ActionTypes.DeleteGigRejected
  }
}

function deleteGigFulfilledAction(gigs) {
  return {
    type: ActionTypes.DeleteGigFulfilled,
    gigs
  };
}
