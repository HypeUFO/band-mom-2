import { combineReducers } from 'redux';
import { appReducer } from './app.reducer';
import { gigReducer } from './gig.reducer';

const rootReducer = combineReducers({
  app: appReducer,
  gigs: gigReducer,
});

export default rootReducer;