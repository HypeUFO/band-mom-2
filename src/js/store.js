import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers/index.reducer'
import thunk from 'redux-thunk';

import { persistStore, autoRehydrate } from 'redux-persist';

// const middleware = applyMiddleware(thunk);

const middleware = [thunk, createLogger()];
let enhancer;

if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) {
  enhancer = compose(
    applyMiddleware(...middleware),
    autoRehydrate(),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  );
} else {
  enhancer = compose(
    applyMiddleware(...middleware),
    autoRehydrate(),
  );
}

export default createStore(
  rootReducer,
  enhancer,
);