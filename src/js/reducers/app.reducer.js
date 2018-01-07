import ActionTypes from '../constants/action_types';
import {
  initializeApp
} from 'firebase';

const initialState = {
  user: null,
  authenticated: false,
  loading: false,
  error: null,
  edit: false,
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
        loading: false,
        error: null,
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
        loading: false,
        error: null,
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
        loading: false,
        error: null,
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
        loading: false,
        error: null,
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
        error: null,
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
        error: null,
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
        error: null,
      }
    case ActionTypes.SIGN_IN_ERROR:
      return {
      ...state,
      authenticated: false,
      loading: false,
      error: action.error.message,
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
        error: null,
      }

    case ActionTypes.SET_NEXT_ROUTE_REJECTED:
      return {
        ...state,
        error: action.error,
        loading: false,
      }


    case ActionTypes.UPDATE_USER_EDIT_REQUESTED:
      return {
          ...state,
      }
    case ActionTypes.UPDATE_USER_EDIT_FULFILLED:
      return {
          ...state,
          edit: !state.edit
      }
    case ActionTypes.UPDATE_USER_EDIT_REJECTED:
      return {
          ...state,
          error: action.error
      }

    case ActionTypes.UPDATE_USER_REQUESTED:
      return {
          ...state,
          loading: true,
      }
    case ActionTypes.UPDATE_USER_FULFILLED:
      return {
          ...state,
          // edit: !state.edit
          user: action.user,
          loading: false,
      }
    case ActionTypes.UPDATE_USER_REJECTED:
      return {
          ...state,
          error: action.error,
          loading: false,
      }

    case ActionTypes.GET_PROFILE_REQUESTED:
      return {
          ...state,
          activeProfile: null,
          loading: true,
      }
    case ActionTypes.GET_PROFILE_FULFILLED:
      return {
          ...state,
          // edit: !state.edit
          activeProfile: action.activeProfile,
          loading: false,
      }
    case ActionTypes.GET_PROFILE_REJECTED:
      return {
          ...state,
          error: action.error,
          loading: false,
      }

    case ActionTypes.CLEAR_PROFILE_REQUESTED:
      return {
          ...state,
          activeProfile: null,
          loading: true,
      }
    case ActionTypes.CLEAR_PROFILE_FULFILLED:
      return {
          ...state,
          // edit: !state.edit
          activeProfile: null,
          loading: false,
      }
    case ActionTypes.CLEAR_PROFILE_REJECTED:
      return {
          ...state,
          error: action.error,
          loading: false,
      }


    case ActionTypes.INVITE_TO_GROUP_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case ActionTypes.INVITE_TO_GROUP_FULFILLED:
      return {
      ...state,
        loading: false,
        // bands: action.bands.bands,
      }
    case ActionTypes.INVITE_TO_GROUP_REJECTED:
      return {
        ...state,
        error: action.error,
        loading: false,
      }

    case ActionTypes.UPLOAD_PROFILE_PIC_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case ActionTypes.UPLOAD_PROFILE_PIC_FULFILLED:
      return {
      ...state,
        loading: false,
        imageUrl: action.imageUrl,
        // bands: action.bands.bands,
      }
    case ActionTypes.UPLOAD_PROFILE_PIC_REJECTED:
      return {
        ...state,
        error: action.error,
        loading: false,
      }
  }
}