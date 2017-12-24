import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers/index.reducer'
import thunk from 'redux-thunk';

import { persistStore, autoRehydrate } from 'redux-persist';

const middleware = applyMiddleware(thunk);

let enhancer = compose(
  middleware,
  autoRehydrate(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default createStore(
  rootReducer,
  enhancer,
);