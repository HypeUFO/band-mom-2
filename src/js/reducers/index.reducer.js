import { combineReducers } from 'redux';
import { appReducer } from './app.reducer';
import { authReducer } from './auth.reducer';
import { eventReducer } from './event.reducer';
import { bandReducer } from './band.reducer';
import { notificationReducer } from './notification.reducer';
import { searchReducer } from './search.reducer';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  events: eventReducer,
  bands: bandReducer,
  notification: notificationReducer,
  search: searchReducer
});

export default rootReducer;