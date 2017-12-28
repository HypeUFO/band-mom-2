import { combineReducers } from 'redux';
import { appReducer } from './app.reducer';
import { eventReducer } from './event.reducer';
import { bandReducer } from './band.reducer';
import { notificationReducer } from './notification.reducer';

const rootReducer = combineReducers({
  app: appReducer,
  events: eventReducer,
  bands: bandReducer,
  notification: notificationReducer,
});

export default rootReducer;