import ActionTypes from '../constants/action_types';
import { database } from '../config/fire';

export function getEvent(id) {
  return dispatch => {
    dispatch(getEventRequestedAction());
    database.ref('/').once('value', snap => {
      const events = snap.val().events;
      let event;
      Object.keys(events).map((key) => {
        if (key === id) {
          events[key].id = id;
          return event = events[key];
        }
        return null;
      });
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



export function getEventMany() {
  // return {type: ActionTypes.getEventManyFulfilled,};
  return dispatch => {
    dispatch(getEventManyRequestedAction());
    database.ref('/').once('value', snap => {
      const events = snap.val();
       return dispatch(getEventManyFulfilledAction(events))
    })
    .catch((error) => {
      console.log(error);
      dispatch(getEventManyRejectedAction());
    });
  }
}

function getEventManyRequestedAction() {
  return {
    type: ActionTypes.GET_EVENTS_MANY_REQUESTED
  };
}

function getEventManyRejectedAction() {
  return {
    type: ActionTypes.GET_EVENTS_MANY_REJECTED
  }
}

function getEventManyFulfilledAction(events) {
  return {
    type: ActionTypes.GET_EVENTS_MANY_FULFILLED,
    events
  };
}

export function createEvent(event) {
  console.log(database.ref().child('events'))
  return dispatch => {
    dispatch(createEventRequestedAction());
    return database.ref().child('events').push().set(event)
    .then(() => {
      dispatch(createEventFulfilledAction());
    })
    .catch((error) => {
      console.log(error);
      dispatch(createEventRejectedAction());
    });
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





export function deleteEvent(event) {
  // return {type: ActionTypes.deleteEventFulfilled,};
  console.log('event to delete: ' + event)
  return dispatch => {
    dispatch(deleteEventRequestedAction(event));
    return database.ref('events').child(event.id).remove()
    .then(() => {
      return dispatch(deleteEventFulfilledAction());
    })
    .catch((error) => {
      console.log(error);
      return dispatch(deleteEventRejectedAction());
    });
  }
}

function deleteEventRequestedAction(event) {
  return {
    type: ActionTypes.DELETE_EVENT_REQUESTED,
    event,
  };
}

function deleteEventRejectedAction() {
  return {
    type: ActionTypes.DELETE_EVENT_REJECTED,
  }
}

function deleteEventFulfilledAction() {
  return {
    type: ActionTypes.DELETE_EVENT_FULFILLED,
    // events
  };
}

export function restoreEvent(event) {
  return dispatch => {
    dispatch(restoreEventRequestedAction());
    return database.ref().child('events').push().set(event)
    .then(() => {
      dispatch(restoreEventFulfilledAction(event));
    })
    .catch((error) => {
      console.log(error);
      dispatch(restoreEventRejectedAction());
    });
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







export function updateEvent(event) {
  return dispatch => {
    dispatch(updateEventRequestedAction());
    database.ref().child('events/' + event.id).update(event)
    .then(() => {
      dispatch(updateEventFulfilledAction());
    })
    .catch((error) => {
      console.log(error);
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