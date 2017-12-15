import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers/index.reducer'
import thunk from 'redux-thunk';

export default createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
);