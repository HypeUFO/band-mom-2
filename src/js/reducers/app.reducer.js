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

  }
}