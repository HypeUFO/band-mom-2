import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import history from '../history';
import {Router, Switch, Route, Redirect} from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Dashboard from './Dashboard';
import NotFound from './NotFound';
import Footer from '../components/Global/Footer';
import Loader from '../components/Global/Loader';

import {routeCodes} from '../route-codes';

export default class App extends Component {
  render() {
    // Clean path
    let pathname = history.location.pathname;
    if (pathname[pathname.length - 1] === '/') {
      pathname = pathname.slice(0, pathname.length - 1)
    }
    return (
      <Router history={history}>
        <div className="app">
          <div className='page'>
            <Switch>
              <Route exact path={routeCodes.LANDING} component={Landing}/>
              <Route exact path={routeCodes.LOGIN} component={Login}/>
              <Route path={routeCodes.REGISTER} component={Register}/>
              <Route path={routeCodes.DASHBOARD} component={Dashboard}/>
              {/* <Route path={routeCodes.ABOUT} component={About}/> */}
              <Route path={routeCodes.FORGOT_PASSWORD} component={ForgotPassword}/>
              <Redirect path="*" to={routeCodes.LOGIN}/>
            </Switch>
          </div>
          {/* <Footer/> */}
        </div>
      </Router>
    );
  }
}
