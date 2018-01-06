import ActionTypes from '../constants/action_types';
import {
  initializeApp
} from 'firebase';

const initialState = {
  users: null,
  error: null,
  loading: false,
}

export function searchReducer(state = initialState, action) {
  switch (action.type) {
    default: return state;

    case ActionTypes.SEARCH_USERS_REQUESTED:
        return {
        ...state,
        loading: true,
      }
    case ActionTypes.SEARCH_USERS_FULFILLED:
        return {
        ...state,
        loading: false,
        users: action.users,
        error: null,
      }
    case ActionTypes.SEARCH_USERS_REJECTED:
        return {
        ...state,
        loading: false,
        error: action.error,
      }
  }
}