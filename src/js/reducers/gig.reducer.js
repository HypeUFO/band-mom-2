import ActionTypes from '../constants/action_types';

export function gigReducer(state = {}, action) {
  switch (action.type) {
    default: return state;

    case ActionTypes.GetGigRequested:
        return {
        ...state,
        // loading: true
      }
    case ActionTypes.GetGigFulfilled:
        return {
        ...state,
        gigs: action.gigs ? action.gigs.gigs : null,
        // loading: false
      }
    case ActionTypes.GetGigRejected:
        return {
        ...state,
        message: action.message,
        // loading: false
      }


    case ActionTypes.CreateGigRequested:
        return {
        ...state,
        // loading: true
      }
    case ActionTypes.CreateGigFulfilled:
        return {
        ...state,
        gigs: action.gigs.gigs,
        // loading: false
      }
    case ActionTypes.CreateGigRejected:
        return {
        ...state,
        message: action.message,
        // loading: false
      }

  }
}