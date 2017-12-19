import ActionTypes from '../constants/action_types';
import database from '../config/fire';

export function getGig(id) {
  return dispatch => {
    dispatch(getGigRequestedAction());
    database.ref('/').once('value', snap => {
      const gigs = snap.val().gigs;
      let gig;
      Object.keys(gigs).map((key) => {
        if (key === id) {
          gigs[key].id = id;
          return gig = gigs[key];
        }
        return null;
      });
       return dispatch(getGigFulfilledAction(gig))
    })
    .catch((error) => {
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

function getGigFulfilledAction(gig) {
  return {
    type: ActionTypes.GetGigFulfilled,
    gig
  };
}



export function getGigMany() {
  // return {type: ActionTypes.GetGigManyFulfilled,};
  return dispatch => {
    dispatch(getGigManyRequestedAction());
    database.ref('/').once('value', snap => {
      const gigs = snap.val();
       return dispatch(getGigManyFulfilledAction(gigs))
    })
    .catch((error) => {
      console.log(error);
      dispatch(getGigManyRejectedAction());
    });
  }
}

function getGigManyRequestedAction() {
  return {
    type: ActionTypes.GetGigManyRequested
  };
}

function getGigManyRejectedAction() {
  return {
    type: ActionTypes.GetGigManyRejected
  }
}

function getGigManyFulfilledAction(gigs) {
  return {
    type: ActionTypes.GetGigManyFulfilled,
    gigs
  };
}

export function createGig(gig) {
  console.log(database.ref().child('gigs'))
  return dispatch => {
    dispatch(createGigRequestedAction());
    return database.ref().child('gigs').push().set(gig)
    .then(() => {
      dispatch(createGigFulfilledAction());
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





export function deleteGig(gig) {
  // return {type: ActionTypes.deleteGigFulfilled,};
  console.log('gig to delete: ' + gig)
  return dispatch => {
    dispatch(deleteGigRequestedAction(gig));
    return database.ref('gigs').child(gig.id).remove()
    .then(() => {
      return dispatch(deleteGigFulfilledAction());
    })
    .catch((error) => {
      console.log(error);
      return dispatch(deleteGigRejectedAction());
    });
  }
}

function deleteGigRequestedAction(gig) {
  return {
    type: ActionTypes.DeleteGigRequested,
    gig,
  };
}

function deleteGigRejectedAction() {
  return {
    type: ActionTypes.DeleteGigRejected,
  }
}

function deleteGigFulfilledAction() {
  return {
    type: ActionTypes.DeleteGigFulfilled,
    // gigs
  };
}

export function restoreGig(gig) {
  console.log(database.ref().child('gigs'))
  return dispatch => {
    dispatch(restoreGigRequestedAction());
    return database.ref().child('gigs').push().set(gig)
    .then(() => {
      dispatch(restoreGigFulfilledAction(gig));
    })
    .catch((error) => {
      console.log(error);
      dispatch(restoreGigRejectedAction());
    });
  }
}

function restoreGigRequestedAction() {
  return {
    type: ActionTypes.RestoreGigRequested
  };
}

function restoreGigRejectedAction() {
  return {
    type: ActionTypes.RestoreGigRejected
  }
}

function restoreGigFulfilledAction(gig) {
  return {
    type: ActionTypes.RestoreGigFulfilled,
    gig
  };
}







export function updateEvent(gig) {
  return dispatch => {
    dispatch(updateGigRequestedAction());
    database.ref().child('gigs/' + gig.id).update(gig)
    .then(() => {
      dispatch(updateGigFulfilledAction());
    })
    .catch((error) => {
      console.log(error);
      dispatch(updateGigRejectedAction());
    });
  }
}

function updateGigRequestedAction() {
  return {
    type: ActionTypes.UpdateGigRequested
  };
}

function updateGigRejectedAction() {
  return {
    type: ActionTypes.UpdateGigRejected
  }
}

function updateGigFulfilledAction(gig) {
  return {
    type: ActionTypes.UpdateGigFulfilled,
    gig
  };
}