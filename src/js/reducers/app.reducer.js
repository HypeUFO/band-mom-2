import ActionTypes from '../constants/action_types';
import {
  initializeApp
} from 'firebase';

const initialState = {
  user: null,
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
        user: action.user,
        authenticated: action.authenticated,
        loading: false,
      }

    case ActionTypes.GetUserRejected:
        return {
        ...state,
        // message: action.message,
        authenticated: false,
        loading: false,
        error: action.error,
      }

    case ActionTypes.SIGN_IN_SUCCESS:
        return {
        ...state,
        authenticated: !!action.user,
        loading: false,
        user: action.user,
      }

    case ActionTypes.SIGN_OUT_REQUESTED:
        return {
        ...state,
        loading: true,
      }

    case ActionTypes.SIGN_OUT_SUCCESS:
        return initialState;

    case ActionTypes.SIGN_OUT_ERROR:
        return {
        ...state,
        loading: false,
        error: action.error,
      }
  }
}