import ActionTypes from '../constants/action_types';

export function gigReducer(state = {}, action) {
  switch(action.type) {
    default:
      return state;

    case ActionTypes.GetGigRequested:
      return {
          ...state,
          // loading: true
      }
    case ActionTypes.GetGigFulfilled:
    return {
        ...state,
        gigs: action.gigs.gigs,
        // loading: false
      }
    case ActionTypes.GetGigRejected:
      return {
          ...state,
          message: action.message,
          // loading: false
        }
  }
}