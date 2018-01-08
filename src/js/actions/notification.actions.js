import ActionTypes from '../constants/action_types';

import { database } from '../config/fire';


export function dismissNotification() {
  return {
    type: ActionTypes.DISMISS_NOTIFICATION,
  };
}

export function getNotificationsMany(user) {
  return dispatch => {
    dispatch(getNotificationsManyRequestedAction());
    database.ref().child("notifications").child(user.id).once('value', snap => {
      const notificationsHash = {}
      snap.forEach(function(child) {
        const groupKey = child.key
        // database.ref('groups').child(groupKey).on('value', snap => {
          const notifications = snap.val();
          notificationsHash[groupKey] = child.val();
        // })
      })
      return dispatch(getNotificationsManyFulfilledAction(notificationsHash))
    })
    .catch((error) => {
      dispatch(getNotificationsManyRejectedAction());
    });
  }
}


function getNotificationsManyRequestedAction() {
  return {
    type: ActionTypes.GET_NOTIFICATIONS_MANY_REQUESTED
  };
}

function getNotificationsManyRejectedAction() {
  return {
    type: ActionTypes.GET_NOTIFICATIONS_MANY_REJECTED
  }
}

function getNotificationsManyFulfilledAction(notifications) {
  return {
    type: ActionTypes.GET_NOTIFICATIONS_MANY_FULFILLED,
    notifications
  };
}
