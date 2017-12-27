// import React, {Component} from 'react';
// import {connect} from 'react-redux';
// import { bindActionCreators } from 'redux';
// import * as actions from '../actions/auth.actions';
// import PropTypes from 'prop-types';

// import history from '../history';
// import {Router, Switch, Route, Redirect} from 'react-router-dom';
// import Landing from './Landing';
// import Login from './Login';
// import Register from './Register';
// import ForgotPassword from './ForgotPassword';
// import EventList from './EventList';
// import EventDetails from './EventDetails';
// import BandDashboard from './BandDashboard';
// import UserDashboard from './UserDashboard';
// // import NotFound from './NotFound';
// import Header from '../components/Global/Header';
// // import Footer from '../components/Global/Footer';
// import Loader from '../components/Global/Loader';

import React, { Component } from 'react'
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom'
import { auth, storageKey } from '../config/fire'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/auth.actions';

import Landing from './Landing';
import Login from './Login';
import Register from './Register';
import UserDashboard from './UserDashboard';
import BandDashboard from './BandDashboard';
// import NotFound from './NotFound';
import Header from '../components/Global/Header';
// import Footer from '../components/Global/Footer';
import Loader from '../components/Global/Loader';
import { routeCodes } from '../route-codes';
import EventList from './EventList';
import EventDetails from './EventDetails';

import store from '../store';

import { persistStore, autoRehydrate } from 'redux-persist';

import CookieStorage from 'redux-persist-cookie-storage';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


function PrivateRoute ({component: Component, authenticated, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
        ? <Component {...props} {...rest} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authenticated, user, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => !authenticated
        ? <Component {...props} />
        : <Redirect to={props.from || `/${user.uid}/dashboard`} />}
    />
  )
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      currentUser: null,
      loading: true,
      rehydrated: false,
    }
    // this.setCurrentUser = this.setCurrentUser.bind(this);
  }

  componentWillMount() {
    this.persistor = persistStore(
      store,
      {
      whitelist: ['app'],
      storage: new CookieStorage({
        expiration: {
          'default': 365 * 86400 // Cookies expire after one year
        }
      })
      },
      () => {
        this.setState({rehydrated: true})
      }
    )

    this.removeListener = auth.onAuthStateChanged((user) => {
      if (user) {
        Promise.resolve()
        .then(() => {
          this.props.onGetUser(user);
        })
        .catch(err => console.log(err))

      } else {
            this.persistor.purge();
            for(let name in cookies.getAll()) {
              cookies.remove(name, { path: '/' });
            }
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }

  setCurrentUser(user) {
    if (user) {
      this.setState({
        currentUser: user,
        authenticated: true,
      })
    } else {
      this.setState({
        currentUser: null,
        authenticated: false,
      })
    }
  }
  render() {
    return this.state.rehydrated === false ? <Loader /> : (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Landing} />
          <PublicRoute
            authenticated={this.props.auth}
            path={routeCodes.LOGIN}
            component={Login}
            user={this.props.user}
          />
          <PublicRoute
            authenticated={this.props.auth}
            path={routeCodes.REGISTER}
            component={Register}
            user={this.props.user}
          />
          <PrivateRoute
            authenticated={this.props.auth}
            path={`/:userId/dashboard`}
            // path={routeCodes.USER_DASHBOARD}
            component={UserDashboard}
          />
          <PrivateRoute
            authenticated={this.props.auth}
            path={routeCodes.EVENT_DETAILS}
            component={EventDetails}
          />
          <PrivateRoute
            authenticated={this.props.auth}
            path={routeCodes.EVENT_LIST}
            component={EventList}
          />
          <PrivateRoute
            authenticated={this.props.auth}
            path={routeCodes.BAND_DASHBOARD}
            component={BandDashboard}
          />
          <Route render={() => <h3>No Match</h3>}/>
          <Redirect to={routeCodes.LOGIN} />
        </Switch>
      </BrowserRouter>
    );
  }
}


function mapStateToProps(state) {
  return {
    loading: state.app.loading,
    user: state.app.user,
    auth: state.app.authenticated,
  };
}

// export default connect(mapStateToProps)(App);

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onGetUser: actions.getUser,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);