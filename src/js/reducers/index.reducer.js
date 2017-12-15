import { combineReducers } from 'redux';
import { gigReducer } from './gig.reducer';

const rootReducer = combineReducers({
  gigs: gigReducer,
});

export default rootReducer;