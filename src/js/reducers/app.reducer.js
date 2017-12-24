import ActionTypes from '../constants/action_types';

const initialState = {
  // user: null,
  loading: false,
}

export function appReducer(state = initialState, action) {
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


  case ActionTypes.CreateUserRequested:
    return {
      ...state,
      // message: action.message,
      loading: true
    }

  case ActionTypes.CreateUserFulfilled:
    return {
      ...state,
      // message: action.message,
      loading: false,
      // user: action.user,
    }

  case ActionTypes.CreateUserRejected:
    return {
      ...state,
      // message: action.message,
      loading: false,
      error: action.error,
    }


  case ActionTypes.GetUserRequested:
    return {
      ...state,
      // message: action.message,
      loading: true
    }

  case ActionTypes.GetUserFulfilled:
    return {
      ...state,
      // message: action.message,
      loading: false,
      user: action.user,
    }

  case ActionTypes.GetUserRejected:
    return {
      ...state,
      // message: action.message,
      loading: false,
      error: action.error,
    }

  }
}