import { combineReducers } from 'redux';
import { appReducer } from './app.reducer';
import { gigReducer } from './gig.reducer';
import { notificationReducer } from './notification.reducer';

const rootReducer = combineReducers({
  app: appReducer,
  gigs: gigReducer,
  notification: notificationReducer,
});

export default rootReducer;