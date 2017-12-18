import ActionTypes from '../constants/action_types';

export function appReducer(state = {}, action) {
  switch (action.type) {
    default: return state;

    case ActionTypes.GetGigRequested:
        return {
        ...state,
        loading: true
      }
    case ActionTypes.GetGigFulfilled:
        return {
        ...state,
        loading: false
      }
    case ActionTypes.GetGigRejected:
        return {
        ...state,
        // message: action.message,
        loading: false
      }

    case ActionTypes.CreateGigRequested:
        return {
        ...state,
        loading: true
      }
    case ActionTypes.CreateGigFulfilled:
        return {
        ...state,
        loading: false
      }
    case ActionTypes.CreateGigRejected:
        return {
        ...state,
        // message: action.message,
        loading: false
      }

    case ActionTypes.DeleteGigRequested:
        return {
        ...state,
        loading: true
      }
    case ActionTypes.DeleteGigFulfilled:
        return {
        ...state,
        loading: false
      }
    case ActionTypes.DeleteGigRejected:
        return {
        ...state,
        // message: action.message,
        loading: false
      }

      case ActionTypes.RestoreGigRequested:
      return {
      ...state,
      loading: true
    }
  case ActionTypes.RestoreGigFulfilled:
      return {
      ...state,
      loading: false
    }
  case ActionTypes.RestoreGigRejected:
      return {
      ...state,
      // message: action.message,
      loading: false
    }

  }
}