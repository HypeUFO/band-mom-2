import ActionTypes from '../constants/action_types';


export function dismissNotification() {
  return {
    type: ActionTypes.DISMISS_NOTIFICATION,
  };
}