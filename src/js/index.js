import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/css/index.css';
import App from './views/App';
import { Provider } from 'react-redux';
import store from './store';
import registerServiceWorker from './registerServiceWorker';

// Load SCSS
// import './styles/scss/index.scss';

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);


ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
