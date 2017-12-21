import ActionTypes from '../constants/action_types';

export function appReducer(state = {}, action) {
  switch (action.type) {
    default: return state;

    case ActionTypes.GetEventRequested:
        return {
        ...state,
        loading: true
      }
    case ActionTypes.GetEventFulfilled:
        return {
        ...state,
        loading: false
      }
    case ActionTypes.GetEventRejected:
        return {
        ...state,
        // message: action.message,
        loading: false
      }

    case ActionTypes.CreateEventRequested:
        return {
        ...state,
        loading: true
      }
    case ActionTypes.CreateEventFulfilled:
        return {
        ...state,
        loading: false
      }
    case ActionTypes.CreateEventRejected:
        return {
        ...state,
        // message: action.message,
        loading: false
      }

    case ActionTypes.DeleteEventRequested:
        return {
        ...state,
        loading: true
      }
    case ActionTypes.DeleteEventFulfilled:
        return {
        ...state,
        loading: false
      }
    case ActionTypes.DeleteEventRejected:
        return {
        ...state,
        // message: action.message,
        loading: false
      }

      case ActionTypes.RestoreEventRequested:
      return {
      ...state,
      loading: true
    }
  case ActionTypes.RestoreEventFulfilled:
      return {
      ...state,
      loading: false
    }
  case ActionTypes.RestoreEventRejected:
      return {
      ...state,
      // message: action.message,
      loading: false
    }

  }
}