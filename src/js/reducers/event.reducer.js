import ActionTypes from '../constants/action_types';

const initialState = {
  events: null,
  activeEvent: null,
  error: null,
  recentlyDeleted: [],
  statusFilter: 'UPCOMING',
  typeFilter: 'ALL',
  edit: false,
}

export function eventReducer(state = initialState, action) {
  switch (action.type) {
    default: return state;

    case ActionTypes.GetEventRequested:
        return {
        ...state,
        // loading: true
      }
    case ActionTypes.GetEventFulfilled:
        return {
        ...state,
        activeEvent: action.event ? action.event : null,
        // loading: false
      }
    case ActionTypes.GetEventRejected:
        return {
        ...state,
        error: action.error,
        // loading: false
      }

    case ActionTypes.GetEventManyRequested:
        return {
        ...state,
        // loading: true
      }
    case ActionTypes.GetEventManyFulfilled:
        return {
        ...state,
        events: action.events ? action.events.events : null,
        // loading: false
      }
    case ActionTypes.GetEventManyRejected:
        return {
        ...state,
        error: action.error,
        // loading: false
      }


    case ActionTypes.CreateEventRequested:
        return {
        ...state,
        // loading: true
      }
    case ActionTypes.CreateEventFulfilled:
        return {
        ...state,
        events: action.events.events,
        // loading: false
      }
    case ActionTypes.CreateEventRejected:
        return {
        ...state,
        error: action.error,
        // loading: false
      }

    case ActionTypes.DeleteEventRequested:
      return {...state, recentlyDeleted: [...state.recentlyDeleted, action.event]}
    case ActionTypes.DeleteEventFulfilled:
        return {
        ...state,
        // gigs: action.gigs.gigs,
        // loading: false
      }
    case ActionTypes.DeleteEventRejected:
        return {
        ...state,
        // error: action.error,
        // loading: false
      }

      case ActionTypes.RestoreEventRequested:
      return {
      ...state,
      }
    case ActionTypes.RestoreEventFulfilled:
      const prunedIds = state.recentlyDeleted.filter(item => {
        console.log('itemId = ' + item.id)
        console.log('eventId = ' + action.event)
        return item.id !== action.event.id // return all the items not matching the action.id
      })
      return {
        ...state, recentlyDeleted: prunedIds,
      }
    case ActionTypes.RestoreEventRejected:
        return {
        ...state,
      }
    case ActionTypes.SetEventStatusFilter:
      return {
          ...state,
          statusFilter: action.filter
      }
    case ActionTypes.SetEventTypeFilter:
      return {
          ...state,
          typeFilter: action.filter
      }
    case ActionTypes.UpdateEventEditRequested:
      return {
          ...state,
      }
    case ActionTypes.UpdateEventEditFulfilled:
      return {
          ...state,
          edit: !state.edit
      }
    case ActionTypes.UpdateEventEditRejected:
      return {
          ...state,
          error: action.error
      }

  }
}