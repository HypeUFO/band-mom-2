import ActionTypes from '../constants/action_types';
import { database, storage } from '../config/fire';

export function getBand(id) {
  return dispatch => {
    dispatch(getBandRequestedAction());
    database.ref('/groups/' + id).once('value', snap => {
      const band = snap.val();
       return dispatch(getBandFulfilledAction(band))
    })
    .catch((err) => {
      dispatch(getBandRejectedAction(err));
    });
  }
}

export function clearBand() {
  return dispatch => {
    Promise.resolve()
    .then(() => dispatch(getBandRequestedAction()))
    .then(() => dispatch(getBandFulfilledAction(null)))
    .catch(err => dispatch(getBandRejectedAction(err)))
  }
}

function getBandRequestedAction() {
  return {
    type: ActionTypes.GET_BAND_REQUESTED
  };
}

function getBandRejectedAction() {
  return {
    type: ActionTypes.GET_BAND_REJECTED
  }
}

function getBandFulfilledAction(band) {
  return {
    type: ActionTypes.GET_BAND_FULFILLED,
    band
  };
}


export function getBandMany(user) {
  return dispatch => {
    dispatch(getBandManyRequestedAction());
    database.ref().child("userGroups").child(user.id).once('value', snap => {
      const bands = {}
      snap.forEach(function(child) {
        console.log(child.key+": "+child.val());
        const groupKey = child.key
        database.ref('groups').child(groupKey).on('value', snap => {
          const band = snap.val();
          console.log(band);
          bands[groupKey] = band;
          console.log(bands);
          //  return dispatch(getBandManyFulfilledAction(bands))
        })
      })
      return dispatch(getBandManyFulfilledAction(bands))
    })
    .catch((error) => {
      console.log(error);
      dispatch(getBandManyRejectedAction());
    });
  }
}


function getBandManyRequestedAction() {
  return {
    type: ActionTypes.GET_BANDS_MANY_REQUESTED
  };
}

function getBandManyRejectedAction() {
  return {
    type: ActionTypes.GET_BANDS_MANY_REJECTED
  }
}

function getBandManyFulfilledAction(bands) {
  return {
    type: ActionTypes.GET_BANDS_MANY_FULFILLED,
    bands
  };
}

export function createBand(band, user) {

  return dispatch => {
    dispatch(createBandRequestedAction());

    const newBandKey = database.ref().child('bands').push().key;
    const userId = user.id;

    const userGroup = {}
    const bandMembers = {}

    userGroup[newBandKey] = true
    bandMembers[userId] = true

    band.id = newBandKey;

    var updates = {};
    updates['/groups/' + newBandKey] = band;
    updates['/users/' + user.id + '/groups'] = userGroup;
    updates['/groupMembers/'+ newBandKey] = bandMembers;
    updates[`/userGroups/${user.id}/${newBandKey}`] = true;

    return database.ref().update(updates)
    .then(() => {
      dispatch(createBandFulfilledAction());
    })
    .catch((error) => {
      console.log(error);
      dispatch(createBandRejectedAction(error));
    });
  }
}



function createBandRequestedAction() {
  return {
    type: ActionTypes.CREATE_BAND_REQUESTED
  };
}

function createBandRejectedAction(error) {
  return {
    type: ActionTypes.CREATE_BAND_REJECTED,
    error
  }
}

function createBandFulfilledAction(bands) {
  return {
    type: ActionTypes.CREATE_BAND_FULFILLED,
    bands
  };
}





export function deleteBand(band) {
  return dispatch => {
    dispatch(deleteBandRequestedAction(band));
    return database.ref('groups').child(band.id).remove()
    .then(() => {
      return dispatch(deleteBandFulfilledAction());
    })
    .catch((error) => {
      console.log(error);
      return dispatch(deleteBandRejectedAction());
    });
  }
}

function deleteBandRequestedAction(band) {
  return {
    type: ActionTypes.DELETE_BAND_REQUESTED,
    band,
  };
}

function deleteBandRejectedAction() {
  return {
    type: ActionTypes.DELETE_BAND_REJECTED,
  }
}

function deleteBandFulfilledAction() {
  return {
    type: ActionTypes.DELETE_BAND_FULFILLED,
  };
}

export function restoreBand(band) {
  return dispatch => {
    dispatch(restoreBandRequestedAction());
    return database.ref().child('groups').push().set(band)
    .then(() => {
      dispatch(restoreBandFulfilledAction(band));
    })
    .catch((error) => {
      console.log(error);
      dispatch(restoreBandRejectedAction());
    });
  }
}

function restoreBandRequestedAction() {
  return {
    type: ActionTypes.RESTORE_BAND_REQUESTED
  };
}

function restoreBandRejectedAction() {
  return {
    type: ActionTypes.RESTORE_BAND_REJECTED
  }
}

function restoreBandFulfilledAction(band) {
  return {
    type: ActionTypes.RESTORE_BAND_FULFILLED,
    band
  };
}



export function updateBand(band) {
  return dispatch => {
    dispatch(updateBandRequestedAction());
    database.ref().child('groups/' + band.id).update(band)
    .then(() => {
      dispatch(updateBandFulfilledAction());
    })
    .catch((error) => {
      console.log(error);
      dispatch(updateBandRejectedAction());
    });
  }
}

function updateBandRequestedAction() {
  return {
    type: ActionTypes.UPDATE_BAND_REQUESTED
  };
}

function updateBandRejectedAction() {
  return {
    type: ActionTypes.UPDATE_BAND_REJECTED
  }
}

function updateBandFulfilledAction(band) {
  return {
    type: ActionTypes.UPDATE_BAND_FULFILLED,
    band
  };
}

export function updateBandEdit() {
  return dispatch => {
    Promise.resolve()
    .then(() => dispatch(updateBandEditRequestedAction()))
    .then(() => {
      dispatch(updateBandEditFulfilledAction());
    })
    .catch((err) => {
      dispatch(updateBandEditRejectedAction(err));
    });
  }
}

function updateBandEditRequestedAction() {
  return {
    type: ActionTypes.UPDATE_BAND_EDIT_REQUESTED
  }
}

function updateBandEditFulfilledAction() {
  return {
    type: ActionTypes.UPDATE_BAND_EDIT_FULFILLED
  };
}

function updateBandEditRejectedAction(error) {
  return {
    type: ActionTypes.UPDATE_BAND_EDIT_REJECTED,
    error
  }
}


export function uploadBandLogo(file) {
  const name = (+new Date()) + '-' + file.name;

  var metadata = {
    name,
  };

  return dispatch => {
    dispatch(uploadBandLogoRequestedAction());
    return storage.ref().child(name).put(file, metadata)
    .then((snapshot) => {
      const url = snapshot.downloadURL;
      console.log(url);
      return dispatch(uploadBandLogoFulfilledAction(url))
    })
    .catch((error) => {
      console.error(error);
      return dispatch(uploadBandLogoRejectedAction(error));
    });
  }
}

function uploadBandLogoRequestedAction() {
  return {
    type: ActionTypes.UPLOAD_BAND_LOGO_REQUESTED
  }
}

function uploadBandLogoFulfilledAction(logoUrl) {
  return {
    type: ActionTypes.UPLOAD_BAND_LOGO_FULFILLED,
    logoUrl
  };
}

function uploadBandLogoRejectedAction(error) {
  return {
    type: ActionTypes.UPLOAD_BAND_LOGO_REJECTED,
    error
  }
}

export function uploadStagePlot(file) {
  const name = (+new Date()) + '-' + file.name;
  var metadata = {
    name,
  };
  return dispatch => {
    dispatch(uploadStagePlotRequestedAction());
    return storage.ref().child(name).put(file, metadata)
    .then((snapshot) => {
      const url = snapshot.downloadURL;
      console.log(url);
      return dispatch(uploadStagePlotFulfilledAction(url))
    })
    .catch((error) => {
      console.error(error);
      return dispatch(uploadStagePlotRejectedAction(error));
    });
  }
}

function uploadStagePlotRequestedAction() {
  return {
    type: ActionTypes.UPLOAD_STAGE_PLOT_REQUESTED
  }
}

function uploadStagePlotFulfilledAction(stagePlotUrl) {
  return {
    type: ActionTypes.UPLOAD_STAGE_PLOT_FULFILLED,
    stagePlotUrl
  };
}

function uploadStagePlotRejectedAction(error) {
  return {
    type: ActionTypes.UPLOAD_STAGE_PLOT_REJECTED,
    error
  }
}