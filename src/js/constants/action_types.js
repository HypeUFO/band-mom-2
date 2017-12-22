const actionTypes = {
  GetEventRequested: 'GET_EVENTS_REQUESTED',
  GetEventRejected: 'GET_EVENTS_REJECTED',
  GetEventFulfilled: 'GET_EVENTS_FULFILLED',

  GetEventManyRequested: 'GET_EVENTS_MANY_REQUESTED',
  GetEventManyRejected: 'GET_EVENTS_MANY_REJECTED',
  GetEventManyFulfilled: 'GET_EVENTS_MANY_FULFILLED',

  CreateEventRequested: 'CREATE_EVENTS_REQUESTED',
  CreateEventRejected: 'CREATE_EVENTS_REJECTED',
  CreateEventFulfilled: 'CREATE_EVENTS_FULFILLED',

  DeleteEventRequested: 'DELETE_EVENTS_REQUESTED',
  DeleteEventRejected: 'DELETE_EVENTS_REJECTED',
  DeleteEventFulfilled: 'DELETE_EVENTS_FULFILLED',

  RestoreEventRequested: 'RESTORE_EVENTS_REQUESTED',
  RestoreEventRejected: 'RESTORE_EVENTS_REJECTED',
  RestoreEventFulfilled: 'RESTORE_EVENTS_FULFILLED',

  UpdateEventRequested: 'UPDATE_EVENTS_REQUESTED',
  UpdateEventRejected: 'UPDATE_EVENTS_REJECTED',
  UpdateEventFulfilled: 'UPDATE_EVENTS_FULFILLED',

  DismissNotification: 'DISMISS_NOTIFICATION',

  SetEventStatusFilter: 'SET_EVENT_STATUS_FILTER',
  SetEventTypeFilter: 'SET_EVENT_TYPE_FILTER',

};

export default actionTypes;