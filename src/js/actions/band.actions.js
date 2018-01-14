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
        const groupKey = child.key
        database.ref('groups').child(groupKey).on('value', snap => {
          const band = snap.val();
          bands[groupKey] = band;
        })
      })
      return dispatch(getBandManyFulfilledAction(bands))
    })
    .catch((error) => {
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

    const newBandKey = database.ref().child('groups').push().key;
    const userId = user.id;

    const userGroup = {}
    const bandMembers = {}

    userGroup[newBandKey] = true
    bandMembers[userId] = true

    band.id = newBandKey;

    var updates = {};
    updates['/groups/' + newBandKey] = band;
    updates['/users/' + user.id + '/groups/' + newBandKey] = true;
    updates['/groupMembers/'+ newBandKey] = bandMembers;
    updates[`/userGroups/${user.id}/${newBandKey}`] = true;

    return database.ref().update(updates)
    .then(() => {
      dispatch(createBandFulfilledAction());
    })
    .catch((error) => {
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


export function deleteBand(band, user) {
  return dispatch => {
    let groupMembers = {};
    let groupEvents = {};
    dispatch(deleteBandRequestedAction(band));
    database.ref().child("groupEvents").child(band.id).once('value', snap => {
      console.log('band.actions line 465 - snap.val = ', snap.val)
      if (snap.val()) {
        Object.keys(snap.val()).map(key => {
            return groupEvents[key] = key;
        })
      }
    })
      return database.ref().child("groupMembers").child(band.id).once('value', snap => {
        if (snap.val()) {
          Object.keys(snap.val()).map(key => {
              return groupMembers[key] = key;
          })
        }
      })
      .then(() => {
      const updates = {};

      const notification = {
        message: `${user.displayName || user.email} has deleted ${band.name}`,
      }

      updates[`/groups/${band.id}`] = null;
      updates[`/groupEvents/${band.id}`] = null;
      updates[`/groupMembers/${band.id}`] = null;

      Object.keys(groupMembers).map(key => {
        const newNotificationKey = database.ref().child('notifications').child(groupMembers[key]).push().key;
        database.ref().child("userEvents").child(groupMembers[key]).once('value', snap => {
          if (snap.val()) {
            Object.keys(snap.val()).map(key2 => {
                database.ref().child("eventGroups").child(key2).child(band.id).remove()
                if (snap.val()[key2].bandId === band.id) {
                  database.ref().child("events").child(key2).remove()
                  database.ref().child("userEvents").child(key).child(key2).remove()
                }
            })
          }
        })
          updates[`/userGroups/${groupMembers[key]}/${band.id}`] = null;
          if (key !== user.id) {
            updates[`/notifications/${groupMembers[key]}/${newNotificationKey}`] = notification;
          }
      })
      return database.ref().update(updates)
    })

    .then(() => {
      return dispatch(deleteBandFulfilledAction());
    })
    .catch((error) => {
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

export function updateBand(band, user) {

  return dispatch => {
    dispatch(updateBandRequestedAction());

    const updates = {};

    const notification = {
      message: `${user.displayName || user.email} has edited ${band.name}`,
    }

    updates[`/groups/${band.id}`] = band;

    database.ref().child("groupMembers").child(band.id).once('value', snap => {
      if (snap.val()) {
        Object.keys(snap.val()).map(key => {
          if (key !== user.id) {
            const newNotificationKey = database.ref().child('notifications').child(key).push().key;
            return database.ref('notifications').child(key).child(newNotificationKey).set(notification);
          }
        })
      }
    })
    console.log(updates);
    return database.ref().update(updates)
    .then(() => {
      dispatch(updateBandFulfilledAction(band));
    })
    .catch((error) => {
      dispatch(updateBandRejectedAction(error));
    });
  }
}

function updateBandRequestedAction() {
  return {
    type: ActionTypes.UPDATE_BAND_REQUESTED
  };
}

function updateBandRejectedAction(error) {
  return {
    type: ActionTypes.UPDATE_BAND_REJECTED,
    error
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


export function uploadBandLogo(file, bandId) {
  const name = (+new Date()) + '-' + file.name;

  var metadata = {
    name,
    contentType: file.type,
  };

  return dispatch => {
    dispatch(uploadBandLogoRequestedAction());
    return storage.ref().child('/groupLogos/' + bandId).child(file.name).put(file, metadata)
    .then((snapshot) => {
      const url = snapshot.downloadURL;
      database.ref('groups').child(bandId).update({logoUrl: url, logoName: file.name});
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

export function uploadStagePlot(file, bandId) {
  const name = (+new Date()) + '-' + file.name;
  var metadata = {
    name,
    contentType: file.type,
  };
  return dispatch => {
    dispatch(uploadStagePlotRequestedAction());
    return storage.ref('stageplots').child(bandId).child(file.name).put(file, metadata)
    .then((snapshot) => {
      const stageplotUrl = snapshot.downloadURL;
      const newStageplot = {};
      newStageplot.url = stageplotUrl;
      newStageplot.name = file.name;
      const key = database.ref('groups').child(bandId).child('stageplots').push(newStageplot).key
      newStageplot.id = key;
      database.ref('groups').child(bandId).child('stageplots').child(key).update(newStageplot)
      return dispatch(uploadStagePlotFulfilledAction(stageplotUrl))
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


export function deleteStagePlot(file, bandId) {
  return dispatch => {
    dispatch(deleteStagePlotRequestedAction());
    return storage.ref('stageplots').child(bandId).child(file.name).delete()
    .then(() => {
      database.ref('groups').child(bandId).child('stageplots').child(file.id).remove();
      return dispatch(deleteStagePlotFulfilledAction())
    })
    .catch((error) => {
      console.error(error);
      return dispatch(deleteStagePlotRejectedAction(error));
    });
  }
}

function deleteStagePlotRequestedAction() {
  return {
    type: ActionTypes.DELETE_STAGE_PLOT_REQUESTED
  }
}

function deleteStagePlotFulfilledAction(stagePlotUrl) {
  return {
    type: ActionTypes.DELETE_STAGE_PLOT_FULFILLED,
    stagePlotUrl
  };
}

function deleteStagePlotRejectedAction(error) {
  return {
    type: ActionTypes.DELETE_STAGE_PLOT_REJECTED,
    error
  }
}


export function sendGroupInvite(band, recipientId, user) {
  const bandId = band.id
  return dispatch => {
    dispatch(sendGroupInviteRequestedAction())
    Promise.resolve()
    .then(() => {
    const newNotificationKey = database.ref().child('notifications').push().key;
    const updates = {};

    const notification = {
      from: user.displayName || user.email,
      message: `${user.displayName || user.email} has invited you to join ${band.name}`,
      action: `acceptGroupInvite`,
      actionType: 'Confirm',
      band: band,
    }
    updates[`/groupMembers/${bandId}/pending/${recipientId}`] = true;
    updates[`/notifications/${recipientId}/${newNotificationKey}`] = notification;

    return database.ref().update(updates)
    .then(() => {
      dispatch(sendGroupInviteFulfilledAction(bandId));
    })
    .catch((error) => {
      dispatch(sendGroupInviteRejectedAction(error));
    });
  })
  }
}



function sendGroupInviteRequestedAction() {
  return {
    type: ActionTypes.INVITE_TO_GROUP_REQUESTED
  };
}

function sendGroupInviteRejectedAction(error) {
  return {
    type: ActionTypes.INVITE_TO_GROUP_REJECTED,
    error
  }
}

function sendGroupInviteFulfilledAction(bandId) {
  return {
    type: ActionTypes.INVITE_TO_GROUP_FULFILLED,
    bandId
  };
}

export function acceptGroupInvite(band, user, notificationId) {
  const userId = user.id
  const bandId = band.id
  let groupMembers = {}
  return dispatch => {
    dispatch(acceptGroupInviteRequestedAction());
    let groupEvents = {}
    return database.ref().child("groupEvents").child(bandId).once('value', snap => {
      if (snap.val()) {
        Object.keys(snap.val()).map(key => {
          return groupEvents[key] = band.id;
        })
      }
    })
    .then(() => {
      // let groupMembers = {}
      return database.ref().child("groupMembers").child(bandId).once('value', snap => {
        console.log('band.actions line 465 - snap.val = ', snap.val)
        if (snap.val()) {
          Object.keys(snap.val()).map(key => {
            if (key !== userId && key !== 'pending') {
              return groupMembers[key] = key;
            }
          })
        }
        console.log('line 473 groupMembers = ', groupMembers)
      })
    .then(() => {
      const notification = {
        // from: user.displayName || user.email,
        message: `${user.displayName || user.email} has joined a ${band.name}`,
        // action: `acceptGroupInvite`,
        // actionType: 'Confirm',
        band: band,
      }

      const userGroup = {}
      const bandMembers = {}

      userGroup[bandId] = true
      bandMembers[userId] = true

      var updates = {};
      updates['/users/' + userId + '/groups/' + bandId] = true;
      updates[`/groupMembers/${bandId}/pending/${userId}`] = null;
      updates[`/groupMembers/${bandId}/${userId}`] = true;
      updates[`/userGroups/${userId}/${bandId}`] = true;
      updates[`/userEvents/${userId}`] = groupEvents;
      updates[`/notifications/${userId}/${notificationId}`] = null;

      Object.keys(groupMembers).map(key => {
        console.log(groupMembers[key]);
        const newNotificationKey = database.ref().child('notifications').child(groupMembers[key]).push().key;
        return updates[`/notifications/${groupMembers[key]}/${newNotificationKey}`] = notification;
      })

      return database.ref().update(updates)
      })
      .then(() => {
        dispatch(acceptGroupInviteFulfilledAction());
      })
      .catch((error) => {
        dispatch(acceptGroupInviteRejectedAction(error));
      });
    })
  }
}



function acceptGroupInviteRequestedAction() {
  return {
    type: ActionTypes.ACCEPT_INVITE_TO_GROUP_REQUESTED
  };
}

function acceptGroupInviteRejectedAction(error) {
  return {
    type: ActionTypes.ACCEPT_INVITE_TO_GROUP_REJECTED,
    error
  }
}

function acceptGroupInviteFulfilledAction(bands) {
  return {
    type: ActionTypes.ACCEPT_INVITE_TO_GROUP_FULFILLED,
    bands
  };
}


export function declineGroupInvite(bandId, userId, notificationId) {

  return dispatch => {
    dispatch(declineGroupInviteRequestedAction());
    Promise.resolve()
    .then(() => {
    var updates = {};
    updates[`/groupMembers/${bandId}/pending/${userId}`] = null;
    updates[`/notifications/${userId}/${notificationId}`] = null;

    return database.ref().update(updates)
    .then(() => {
      dispatch(declineGroupInviteFulfilledAction());
    })
    .catch((error) => {
      dispatch(declineGroupInviteRejectedAction(error));
    });
  })
  }
}



function declineGroupInviteRequestedAction() {
  return {
    type: ActionTypes.DECLINE_INVITE_TO_GROUP_REQUESTED
  };
}

function declineGroupInviteRejectedAction(error) {
  return {
    type: ActionTypes.DECLINE_INVITE_TO_GROUP_REJECTED,
    error
  }
}

function declineGroupInviteFulfilledAction(bands) {
  return {
    type: ActionTypes.DECLINE_INVITE_TO_GROUP_FULFILLED,
    bands
  };
}



export function leaveBand(band, user) {
  return dispatch => {
    const updates = {};
    const notification = {
      message: `${user.displayName || user.email} has left ${band.name}`,
    }
    dispatch(leaveBandRequestedAction(band));

      return database.ref().child("groupMembers").child(band.id).once('value', snap => {
        if (snap.val()) {
          Object.keys(snap.val()).map(key => {
            if (key !== user.id) {
              const newNotificationKey = database.ref().child('notifications').child(key).push().key;
              return updates[`/notifications/${key}/${newNotificationKey}`] = notification;
            }
          })
        }
      })
      .then(() => {

      updates[`/groupMembers/${band.id}/${user.id}`] = null;
      updates[`/userGroups/${user.id}/${band.id}`] = null;

      return database.ref().update(updates)
    })
    .then(() => {
      return dispatch(leaveBandFulfilledAction());
    })
    .catch((error) => {
      return dispatch(leaveBandRejectedAction());
    });
  }
}

function leaveBandRequestedAction(band) {
  return {
    type: ActionTypes.LEAVE_BAND_REQUESTED,
    band,
  };
}

function leaveBandRejectedAction() {
  return {
    type: ActionTypes.LEAVE_BAND_REJECTED,
  }
}

function leaveBandFulfilledAction() {
  return {
    type: ActionTypes.LEAVE_BAND_FULFILLED,
  };
}
