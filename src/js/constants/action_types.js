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

  UpdateEventEditRequested: 'UPDATE_EVENT_EDIT_REQUESTED',
  UpdateEventEditFulfilled: 'UPDATE_EVENT_EDIT_FULFILLED',
  UpdateEventEditRejected: 'UPDATE_EVENT_EDIT_REJECTED',

  CreateUserRequested: 'CREATE_USER_REQUESTED',
  CreateUserFulfilled: 'CREATE_USER_FULFILLED',
  CreateUserRejected: 'CREATE_USER_REJECTED',

  GetUserRequested: 'GET_USER_REQUESTED',
  GetUserFulfilled: 'GET_USER_FULFILLED',
  GetUserRejected: 'GET_USER_REJECTED',
};

export default actionTypes;