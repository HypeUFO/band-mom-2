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
    type: ActionTypes.GetEventRequested
  };
}

function getEventRejectedAction() {
  return {
    type: ActionTypes.GetEventRejected
  }
}

function getEventFulfilledAction(event) {
  return {
    type: ActionTypes.GetEventFulfilled,
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
    type: ActionTypes.GetEventManyRequested
  };
}

function getEventManyRejectedAction() {
  return {
    type: ActionTypes.GetEventManyRejected
  }
}

function getEventManyFulfilledAction(events) {
  return {
    type: ActionTypes.GetEventManyFulfilled,
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
    type: ActionTypes.CreateEventRequested
  };
}

function createEventRejectedAction() {
  return {
    type: ActionTypes.CreateEventRejected
  }
}

function createEventFulfilledAction(events) {
  return {
    type: ActionTypes.CreateEventFulfilled,
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
    type: ActionTypes.DeleteEventRequested,
    event,
  };
}

function deleteEventRejectedAction() {
  return {
    type: ActionTypes.DeleteEventRejected,
  }
}

function deleteEventFulfilledAction() {
  return {
    type: ActionTypes.DeleteEventFulfilled,
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
    type: ActionTypes.RestoreEventRequested
  };
}

function restoreEventRejectedAction() {
  return {
    type: ActionTypes.RestoreEventRejected
  }
}

function restoreEventFulfilledAction(event) {
  return {
    type: ActionTypes.RestoreEventFulfilled,
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
    type: ActionTypes.UpdateEventRequested
  };
}

function updateEventRejectedAction() {
  return {
    type: ActionTypes.UpdateEventRejected
  }
}

function updateEventFulfilledAction(event) {
  return {
    type: ActionTypes.UpdateEventFulfilled,
    event
  };
}

export function filterEventsByStatus(filter) {
  return {
        type: ActionTypes.SetEventStatusFilter,
        filter,
  }
}

export function filterEventsByType(filter) {
  return {
        type: ActionTypes.SetEventTypeFilter,
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
    type: ActionTypes.UpdateEventEditRequested
  }
}

function updateEventEditFulfilledAction() {
  return {
    type: ActionTypes.UpdateEventEditFulfilled
  };
}

function updateEventEditRejectedAction(error) {
  return {
    type: ActionTypes.UpdateEventEditRejected,
    error
  }
}