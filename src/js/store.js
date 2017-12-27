import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers/index.reducer'
import thunk from 'redux-thunk';

import { persistStore, autoRehydrate } from 'redux-persist';

// const middleware = applyMiddleware(thunk);

const middleware = [thunk, createLogger()];



let enhancer = compose(
  applyMiddleware(...middleware),
  autoRehydrate(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default createStore(
  rootReducer,
  enhancer,
);