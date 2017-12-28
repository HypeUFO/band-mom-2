import ActionTypes from '../constants/action_types';
import {
  initializeApp
} from 'firebase';

const initialState = {
  user: null,
  loading: false,
  error: null,
}

export function appReducer(state = initialState, action) {
  switch (action.type) {
    default: return state;

    case ActionTypes.GET_EVENT_REQUESTED:
        return {
        ...state,
        loading: true
      }
    case ActionTypes.GET_EVENT_FULFILLED:
        return {
        ...state,
        loading: false
      }
    case ActionTypes.GET_EVENT_REJECTED:
        return {
        ...state,
        loading: false,
        error: action.error,
      }

    case ActionTypes.CREATE_EVENT_REQUESTED:
        return {
        ...state,
        loading: true
      }
    case ActionTypes.CREATE_EVENT_FULFILLED:
        return {
        ...state,
        loading: false
      }
    case ActionTypes.CREATE_EVENT_REJECTED:
        return {
        ...state,
        // message: action.message,
        loading: false,
        error: action.error,
      }

    case ActionTypes.DELETE_EVENT_REQUESTED:
        return {
        ...state,
        loading: true
      }
    case ActionTypes.DELETE_EVENT_FULFILLED:
        return {
        ...state,
        loading: false
      }
    case ActionTypes.DELETE_EVENT_REJECTED:
        return {
        ...state,
        // message: action.message,
        loading: false,
        error: action.error,
      }

    case ActionTypes.RESTORE_EVENT_REQUESTED:
        return {
        ...state,
        loading: true
      }
    case ActionTypes.RESTORE_EVENT_FULFILLED:
        return {
        ...state,
        loading: false
      }
    case ActionTypes.RESTORE_EVENT_REJECTED:
        return {
        ...state,
        // message: action.message,
        loading: false,
        error: action.error,
      }


    case ActionTypes.CREATE_USER_REQUESTED:
        return {
        ...state,
        // message: action.message,
        loading: true
      }

    case ActionTypes.CREATE_USER_FULFILLED:
        return {
        ...state,
        // message: action.message,
        loading: false,
        // user: action.user,
      }

    case ActionTypes.CREATE_USER_REJECTED:
        return {
        ...state,
        // message: action.message,
        loading: false,
        error: action.error,
      }


    case ActionTypes.GET_USER_REQUESTED:
        return {
        ...state,
        // message: action.message,
        loading: true
      }

    case ActionTypes.GET_USER_FULFILLED:
        return {
        ...state,
        // message: action.message,
        user: action.user,
        authenticated: action.authenticated,
        loading: false,
      }

    case ActionTypes.GET_USER_REJECTED:
        return {
        ...state,
        authenticated: false,
        loading: false,
        error: action.error,
      }

    case ActionTypes.SIGN_IN_REQUESTED:
      return {
      ...state,
      loading: true,
    }

    case ActionTypes.SIGN_IN_SUCCESS:
        return {
        ...state,
        authenticated: !!action.user,
        loading: false,
        user: action.user,
      }
    case ActionTypes.SIGN_IN_ERROR:
      return {
      ...state,
      authenticated: false,
      loading: false,
      error: action.error.code,
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

    case ActionTypes.SET_NEXT_ROUTE_REQUESTED:
      return {
        ...state,
        loading: true,
      }

    case ActionTypes.SET_NEXT_ROUTE_FULFILLED:
      return {
        ...state,
        nextRoute: action.nextRoute,
        loading: false,
      }

    case ActionTypes.SET_NEXT_ROUTE_REJECTED:
      return {
        ...state,
        error: action.error,
        loading: false,
      }

  }
}