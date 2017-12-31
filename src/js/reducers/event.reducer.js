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

    case ActionTypes.GET_EVENT_REQUESTED:
        return {
        ...state,
      }
    case ActionTypes.GET_EVENT_FULFILLED:
        return {
        ...state,
        activeEvent: action.event ? action.event : null,
      }
    case ActionTypes.GET_EVENT_REJECTED:
        return {
        ...state,
        error: action.error,
      }

    case ActionTypes.GET_EVENTS_MANY_REQUESTED:
        return {
        ...state,
      }
    case ActionTypes.GET_EVENTS_MANY_FULFILLED:
        return {
        ...state,
        events: action.events ? action.events : null,
      }
    case ActionTypes.GET_EVENTS_MANY_REJECTED:
        return {
        ...state,
        error: action.error,
      }

    case ActionTypes.GET_USER_EVENTS_MANY_REQUESTED:
        return {
        ...state,
      }
    case ActionTypes.GET_USER_EVENTS_MANY_FULFILLED:
        return {
        ...state,
        userEvents: action.events ? action.events : null,
      }
    case ActionTypes.GET_USER_EVENTS_MANY_REJECTED:
        return {
        ...state,
        error: action.error,
      }


    case ActionTypes.CREATE_EVENT_REQUESTED:
        return {
        ...state,
      }
    case ActionTypes.CREATE_EVENT_FULFILLED:
        return {
        ...state,
        // events: action.events.events,
      }
    case ActionTypes.CREATE_EVENT_REJECTED:
        return {
        ...state,
        error: action.error,
      }

    case ActionTypes.DELETE_EVENT_REQUESTED:
        return {
        ...state,
      }
    case ActionTypes.DELETE_EVENT_FULFILLED:
      return {
        ...state,
        recentlyDeleted: [...state.recentlyDeleted, action.event],
      }

    case ActionTypes.DELETE_EVENT_REJECTED:
        return {
        ...state,
        error: action.error,
      }

      case ActionTypes.RESTORE_EVENT_REQUESTED:
      return {
      ...state,
      }
    case ActionTypes.RESTORE_EVENT_FULFILLED:
      const prunedIds = state.recentlyDeleted.filter(item => {
        console.log('itemId = ' + item.id)
        console.log('eventId = ' + action.event)
        return item.id !== action.event.id // return all the items not matching the action.id
      })
      return {
        ...state, recentlyDeleted: prunedIds,
      }
    case ActionTypes.RESTORE_EVENT_REJECTED:
        return {
        ...state,
      }
    case ActionTypes.SET_EVENT_STATUS_FILTER:
      return {
          ...state,
          statusFilter: action.filter
      }
    case ActionTypes.SET_EVENT_TYPE_FILTER:
      return {
          ...state,
          typeFilter: action.filter
      }
    case ActionTypes.UPDATE_EVENT_EDIT_REQUESTED:
      return {
          ...state,
      }
    case ActionTypes.UPDATE_EVENT_EDIT_FULFILLED:
      return {
          ...state,
          edit: !state.edit
      }
    case ActionTypes.UPDATE_EVENT_EDIT_REJECTED:
      return {
          ...state,
          error: action.error
      }

  }
}