import ActionTypes from '../constants/action_types';
import { database } from '../config/fire';

export function getEvent(eventId, bandId, ) {
  return dispatch => {
    dispatch(getEventRequestedAction());
    database.ref(`events/${eventId}`).once('value', snap => {
      let event = snap.val()
       return dispatch(getEventFulfilledAction(event))
    })
    .catch((err) => {
      dispatch(getEventRejectedAction(err));
    });
  }
}

export function clearEvent() {
  return dispatch => {
    Promise.resolve()
    .then(() => dispatch(getEventRequestedAction()))
    .then(() => dispatch(getEventFulfilledAction(null)))
    .catch(err => dispatch(getEventRejectedAction(err)))
  }
}

function getEventRequestedAction() {
  return {
    type: ActionTypes.GET_EVENT_REQUESTED
  };
}

function getEventRejectedAction() {
  return {
    type: ActionTypes.GET_EVENT_REJECTED
  }
}

function getEventFulfilledAction(event) {
  return {
    type: ActionTypes.GET_EVENT_FULFILLED,
    event
  };
}


export function getEventMany(bandId) {
  return dispatch => {
    dispatch(getEventManyRequestedAction());
    database.ref().child("groupEvents").child(bandId).once('value', snap => {
      const events = {}
      snap.forEach(function(child) {
      const eventKey = child.key
      database.ref('events').child(eventKey).on('value', snap => {
        const event = snap.val();
        events[eventKey] = event;
      })
    })
      return dispatch(getEventManyFulfilledAction(events))
    })
    .catch((error) => {
      dispatch(getEventManyRejectedAction());
    });
  }
}


function getEventManyRequestedAction() {
  return {
    type: ActionTypes.GET_EVENTS_MANY_REQUESTED
  };
}

function getEventManyRejectedAction(error) {
  return {
    type: ActionTypes.GET_EVENTS_MANY_REJECTED,
    error
  }
}

function getEventManyFulfilledAction(events) {
  return {
    type: ActionTypes.GET_EVENTS_MANY_FULFILLED,
    events
  };
}


export function getUserEventMany(userId) {
  return dispatch => {
    dispatch(getUserEventManyRequestedAction());
    database.ref().child("userEvents").child(userId).once('value', snap => {
      const events = {}
      snap.forEach(function(child) {
      const eventKey = child.key
      database.ref('events').child(eventKey).on('value', snap => {
        const event = snap.val();
        events[eventKey] = event;
      })
    })
      return dispatch(getUserEventManyFulfilledAction(events))
    })
    .catch((error) => {
      dispatch(getUserEventManyRejectedAction());
    });
  }

}


function getUserEventManyRequestedAction() {
  return {
    type: ActionTypes.GET_USER_EVENTS_MANY_REQUESTED
  };
}

function getUserEventManyRejectedAction(error) {
  return {
    type: ActionTypes.GET_USER_EVENTS_MANY_REJECTED,
    error
  }
}

function getUserEventManyFulfilledAction(events) {
  return {
    type: ActionTypes.GET_USER_EVENTS_MANY_FULFILLED,
    events
  };
}


export function createEvent(event, bandId, userId) {

  return dispatch => {
    dispatch(createEventRequestedAction());
    let groupMembers = {}
    return database.ref().child("groupMembers").child(bandId).once('value', snap => {
      if (snap.val()) {
        Object.keys(snap.val()).map(key => {
          if (key !== userId) {
            return groupMembers[key] = true;
          }
        })
      }
    })
    .then(() => {
    const newEventKey = database.ref().child('events').push().key;

    const eventGroup = {}
    const groupEvents = {}

    eventGroup[bandId] = true
    groupEvents[newEventKey] = true

    event.id = newEventKey;

    var updates = {};

    updates[`/events/${newEventKey}`] = event;
    updates[`/groups/${bandId}/events`] = eventGroup;
    updates[`/eventGroups//${newEventKey}`] = eventGroup;
    updates[`/groupEvents/${bandId}/${newEventKey}`] = true;
    updates[`/userEvents/${userId}/${newEventKey}`] = true;

    Object.keys(groupMembers).map(key => {
      return updates[`/userEvents/${key}/${newEventKey}`] = true;
    })

    return database.ref().update(updates)
    .then(() => {
      dispatch(createEventFulfilledAction());
    })
    .catch((error) => {
      dispatch(createEventRejectedAction());
    });
  })
  }
}

function createEventRequestedAction() {
  return {
    type: ActionTypes.CREATE_EVENT_REQUESTED
  };
}

function createEventRejectedAction() {
  return {
    type: ActionTypes.CREATE_EVENT_REJECTED
  }
}

function createEventFulfilledAction(events) {
  return {
    type: ActionTypes.CREATE_EVENT_FULFILLED,
    events
  };
}


export function deleteEvent(event, bandId, userId) {

  return dispatch => {
    dispatch(deleteEventRequestedAction());

    let groupMembers = {}
    return database.ref().child("groupMembers").child(bandId).once('value', snap => {
      if (snap.val()) {
        Object.keys(snap.val()).map(key => {
          if (key !== userId) {
            return groupMembers[key] = true;
          }
        })
      }
    })
    .then(() => {
      var updates = {};

      updates[`/events/${event.id}`] = null;
      updates[`/groups/${bandId}/events/${bandId}`] = null;
      updates[`/eventGroups//${event.id}/${bandId}`] = null;
      updates[`/groupEvents/${bandId}/${event.id}`] = null;
      updates[`/userEvents/${userId}/${event.id}`] = null;

      Object.keys(groupMembers).map(key => {
        return updates[`/userEvents/${key}/${event.id}`] = null;
      })

      return database.ref().update(updates)

      .then(() => {
        dispatch(deleteEventFulfilledAction(event));
      })
      .catch((error) => {
        dispatch(deleteEventRejectedAction());
      });
    })
  }
}

function deleteEventRequestedAction() {
  return {
    type: ActionTypes.DELETE_EVENT_REQUESTED,
    // event,
  };
}

function deleteEventRejectedAction() {
  return {
    type: ActionTypes.DELETE_EVENT_REJECTED,
  }
}

function deleteEventFulfilledAction(event) {
  return {
    type: ActionTypes.DELETE_EVENT_FULFILLED,
    event,
  };
}


export function restoreEvent(event, bandId, userId) {

  return dispatch => {
    dispatch(restoreEventRequestedAction());
    let groupMembers = {}
    return database.ref().child("groupMembers").child(bandId).once('value', snap => {
      if (snap.val()) {
        Object.keys(snap.val()).map(key => {
          if (key !== userId) {
            return groupMembers[key] = true;
          }
        })
      }
    })
    .then(() => {
    const newEventKey = database.ref().child('events').push().key;

    const eventGroup = {}
    const groupEvents = {}

    eventGroup[bandId] = true
    groupEvents[newEventKey] = true

    event.id = newEventKey;

    var updates = {};

    updates[`/events/${newEventKey}`] = event;
    updates[`/groups/${bandId}/events`] = eventGroup;
    updates[`/eventGroups//${newEventKey}`] = eventGroup;
    updates[`/groupEvents/${bandId}/${newEventKey}`] = true;
    updates[`/userEvents/${userId}/${newEventKey}`] = true;

    Object.keys(groupMembers).map(key => {
      return updates[`/userEvents/${key}/${newEventKey}`] = true;
    })

    return database.ref().update(updates)
    .then(() => {
      dispatch(restoreEventFulfilledAction());
    })
    .catch((error) => {
      dispatch(restoreEventRejectedAction());
    });
  })
  }
}

function restoreEventRequestedAction() {
  return {
    type: ActionTypes.RESTORE_EVENT_REQUESTED
  };
}

function restoreEventRejectedAction() {
  return {
    type: ActionTypes.RESTORE_EVENT_REJECTED
  }
}

function restoreEventFulfilledAction(event) {
  return {
    type: ActionTypes.RESTORE_EVENT_FULFILLED,
    event
  };
}


export function updateEvent(event, bandId) {
  return dispatch => {
    dispatch(updateEventRequestedAction());
    database.ref(`events/${event.id}`).update(event)
    .then(() => {
      dispatch(updateEventFulfilledAction());
    })
    .catch((error) => {
      dispatch(updateEventRejectedAction());
    });
  }
}

function updateEventRequestedAction() {
  return {
    type: ActionTypes.UPDATE_EVENT_REQUESTED
  };
}

function updateEventRejectedAction() {
  return {
    type: ActionTypes.UPDATE_EVENT_REJECTED
  }
}

function updateEventFulfilledAction(event) {
  return {
    type: ActionTypes.UPDATE_EVENT_FULFILLED,
    event
  };
}

export function filterEventsByStatus(filter) {
  return {
        type: ActionTypes.SET_EVENT_STATUS_FILTER,
        filter,
  }
}

export function filterEventsByType(filter) {
  return {
        type: ActionTypes.SET_EVENT_TYPE_FILTER,
        filter,
  }
}

export function updateEventEdit() {
  return dispatch => {
    Promise.resolve()
    .then(() => dispatch(updateEventEditRequestedAction()))
    .then(() => {
      dispatch(updateEventEditFulfilledAction());
    })
    .catch((err) => {
      dispatch(updateEventEditRejectedAction(err));
    });
  }
}

function updateEventEditRequestedAction() {
  return {
    type: ActionTypes.UPDATE_EVENT_EDIT_REQUESTED
  }
}

function updateEventEditFulfilledAction() {
  return {
    type: ActionTypes.UPDATE_EVENT_EDIT_FULFILLED
  };
}

function updateEventEditRejectedAction(error) {
  return {
    type: ActionTypes.UPDATE_EVENT_EDIT_REJECTED,
    error
  }
}