import ActionTypes from '../constants/action_types';

const initialState = {
  gigs: null,
  message: null,
  recentlyDeleted: [],
}

export function gigReducer(state = initialState, action) {
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

    case ActionTypes.DeleteGigRequested:
      return {...state, recentlyDeleted: [...state.recentlyDeleted, action.gig]}
    case ActionTypes.DeleteGigFulfilled:
        return {
        ...state,
        // gigs: action.gigs.gigs,
        // loading: false
      }
    case ActionTypes.DeleteGigRejected:
        return {
        ...state,
        // message: action.message,
        // loading: false
      }

      case ActionTypes.RestoreGigRequested:
      return {
      ...state,
      }
    case ActionTypes.RestoreGigFulfilled:
      const prunedIds = state.recentlyDeleted.filter(item => {
        console.log('itemId = ' + item.id)
        console.log('gigId = ' + action.gig)
        return item.id !== action.gig.id // return all the items not matching the action.id
      })
      return {
        ...state, recentlyDeleted: prunedIds,
      }
    case ActionTypes.RestoreGigRejected:
        return {
        ...state,
      }

  }
}