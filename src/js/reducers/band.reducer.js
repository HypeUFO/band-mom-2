import ActionTypes from '../constants/action_types';

const initialState = {
  bands: {},
  activeBand: null,
  error: null,
  recentlyDeleted: [],
  edit: false,
}

export function bandReducer(state = initialState, action) {
  switch (action.type) {
    default: return state;

    case ActionTypes.GET_BAND_REQUESTED:
        return {
        ...state,
      }
    case ActionTypes.GET_BAND_FULFILLED:
        return {
        ...state,
        activeBand: action.band ? action.band : null,
      }
    case ActionTypes.GET_BAND_REJECTED:
        return {
        ...state,
        error: action.error,
      }

    case ActionTypes.GET_BANDS_MANY_REQUESTED:
        return {
        ...state,
      }
    case ActionTypes.GET_BANDS_MANY_FULFILLED:
        return {
        ...state,
        bands: action.bands ? action.bands : null,
      }
    case ActionTypes.GET_BANDS_MANY_REJECTED:
        return {
        ...state,
        error: action.error,
      }


    case ActionTypes.CREATE_BAND_REQUESTED:
        return {
        ...state,
      }
    case ActionTypes.CREATE_BAND_FULFILLED:
        return {
        ...state,
        // bands: action.bands.bands,
      }
    case ActionTypes.CREATE_BAND_REJECTED:
        return {
        ...state,
        error: action.error,
      }

    case ActionTypes.DELETE_BAND_REQUESTED:
        return {
        ...state,
      }
    case ActionTypes.DELETE_BAND_FULFILLED:
      return {
        ...state,
        recentlyDeleted: [...state.recentlyDeleted, action.band],
      }

    case ActionTypes.DELETE_BAND_REJECTED:
        return {
        ...state,
        error: action.error,
      }

      case ActionTypes.RESTORE_BAND_REQUESTED:
      return {
      ...state,
      }
    case ActionTypes.RESTORE_BAND_FULFILLED:
      const prunedIds = state.recentlyDeleted.filter(item => {
        console.log('itemId = ' + item.id)
        console.log('bandId = ' + action.band)
        return item.id !== action.band.id // return all the items not matching the action.id
      })
      return {
        ...state, recentlyDeleted: prunedIds,
      }
    case ActionTypes.RESTORE_BAND_REJECTED:
        return {
        ...state,
      }

    case ActionTypes.UPDATE_BAND_REQUESTED:
      return {
          ...state,
      }
    case ActionTypes.UPDATE_BAND_FULFILLED:
      return {
          ...state,
          activeBandLogoUrl: null,
      }
    case ActionTypes.UPDATE_BAND_REJECTED:
      return {
          ...state,
          error: action.error,
          activeBandLogoUrl: null
      }


    case ActionTypes.UPDATE_BAND_EDIT_REQUESTED:
      return {
          ...state,
      }
    case ActionTypes.UPDATE_BAND_EDIT_FULFILLED:
      return {
          ...state,
          edit: !state.edit
      }
    case ActionTypes.UPDATE_BAND_EDIT_REJECTED:
      return {
          ...state,
          error: action.error
      }

    case ActionTypes.UPLOAD_BAND_LOGO_REQUESTED:
      return {
          ...state,
          loading: true,
      }
    case ActionTypes.UPLOAD_BAND_LOGO_FULFILLED:
      return {
          ...state,
          activeBandLogoUrl: action.logoUrl,
          loading: false,
      }
    case ActionTypes.UPLOAD_BAND_LOGO_REJECTED:
      return {
          ...state,
          error: action.error,
          loading: false,
      }

    case ActionTypes.UPLOAD_STAGE_PLOT_REQUESTED:
      return {
          ...state,
          loading: true,
      }
    case ActionTypes.UPLOAD_STAGE_PLOT_FULFILLED:
      return {
          ...state,
          activeBandStagePlotUrl: action.stagePlotUrl,
          loading: false,
      }
    case ActionTypes.UPLOAD_STAGE_PLOT_REJECTED:
      return {
          ...state,
          error: action.error,
          loading: false,
      }

    case ActionTypes.DELETE_STAGE_PLOT_REQUESTED:
      return {
          ...state,
          loading: true,
      }
    case ActionTypes.DELETE_STAGE_PLOT_FULFILLED:
      return {
          ...state,
          loading: false,
      }
    case ActionTypes.DELETE_STAGE_PLOT_REJECTED:
      return {
          ...state,
          error: action.error,
          loading: false,
      }


    case ActionTypes.INVITE_TO_GROUP_REQUESTED:
      return {
        ...state,
      }
    case ActionTypes.INVITE_TO_GROUP_FULFILLED:
      return {
      ...state,
      // bands: action.bands.bands,
      }
    case ActionTypes.INVITE_TO_GROUP_REJECTED:
      return {
      ...state,
      error: action.error,
      }

  }
}