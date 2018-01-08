// import { Record } from 'immutable';
// import { REMOVE_TASK_SUCCESS } from 'src/tasks';
import ActionTypes from '../constants/action_types';


const initialState = {
  actionLabel: '',
  display: false,
  message: ''
};

// const initialState = {
//   actionLabel: 'UNDO',
//   display: true,
//   message: 'Test Message'
// };


export function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.DELETE_EVENT_FULFILLED:
      return {
        ...state,
        actionLabel: 'Undo',
        display: true,
        message: 'Event deleted'
      }

    case ActionTypes.DISMISS_NOTIFICATION:
      return {
        ...state,
        display: false,
      }

    default:
      return {
        ...state,
        state: initialState,
      }


    case ActionTypes.GET_NOTIFICATIONS_MANY_REQUESTED:
      return {
        ...state,
        // actionLabel: 'Undo',
        // display: true,
        // message: 'Event deleted'
      }

    case ActionTypes.GET_NOTIFICATIONS_MANY_REJECTED:
      return {
        ...state,
        // display: false,
      }

    case ActionTypes.GET_NOTIFICATIONS_MANY_FULFILLED:
      return {
        ...state,
        notifications: action.notifications
      }
  }
}

