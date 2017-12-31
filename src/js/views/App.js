import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { persistStore } from 'redux-persist';
import CookieStorage from 'redux-persist-cookie-storage';
import Cookies from 'universal-cookie';

import * as actions from '../actions/auth.actions';
import BandDashboard from './BandDashboard';
import BandList from './BandList';
import BandDetails from './BandDetails';
import EventDetails from './EventDetails';
import EventList from './EventList';
import ForgotPassword from './ForgotPassword';
import Header from '../components/Global/Header';
import history from '../history';
import Landing from './Landing';
import Loader from '../components/Global/Loader';
import Login from './Login';
import Register from './Register';
import UserDashboard from './UserDashboard';
import UserEventList from './UserEventList';
import store from '../store';

import { auth, storageKey } from '../config/fire'

import { routeCodes } from '../route-codes';

// import Footer from '../components/Global/Footer';
// import NotFound from './NotFound';

const cookies = new Cookies();


function PrivateRoute ({component: Component, authenticated, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
        ? <Component {...props} {...rest} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />
      }
    />
  )
}

function PublicRoute ({component: Component, authenticated, user, from, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => {
        return !authenticated
        ? <Component {...props} />
        : <Redirect to={ from || `/${user.id}/dashboard` } />
        }
      }
    />
  )
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rehydrated: false,
    }
  }

  componentWillMount() {
    this.persistor = persistStore(
      store,
      {
      whitelist: ['app', 'bands'],
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

  render() {
    // Clean path
    let pathname = history.location.pathname;
    if (pathname[pathname.length - 1] === '/') {
      pathname = pathname.slice(0, pathname.length - 1)
    }

    // Display or hide header
    let header;
    if ((pathname || pathname + '/') === (routeCodes.LANDING)) {
      header = null;
      // console.log(header);
    } else if ((pathname || pathname + '/') === (routeCodes.LOGIN)) {
      header = null;
    } else if ((pathname || pathname + '/') === (routeCodes.REGISTER)) {
      header = null;
    } else {
      header = <Header />;
    }
    return this.state.rehydrated === false ? <Loader /> : (
      <BrowserRouter>
        <div className="app">
          { header }
          <div className='page'>
            <Switch>
              <PrivateRoute
                authenticated={this.props.auth}
                path={`/:userId/events`}
                // path={routeCodes.USER_DASHBOARD}
                component={UserEventList}
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
              <PrivateRoute
                authenticated={this.props.auth}
                path={routeCodes.BAND_DETAILS}
                component={BandDetails}
              />
              <PrivateRoute
                authenticated={this.props.auth}
                path={routeCodes.BAND_LIST}
                component={BandList}
              />
              <PublicRoute
                authenticated={this.props.auth}
                path={routeCodes.LOGIN}
                component={Login}
                user={this.props.user}
                from={this.props.from}
              />
              <PublicRoute
                authenticated={this.props.auth}
                path={routeCodes.REGISTER}
                component={Register}
                user={this.props.user}
                from={this.props.from}
              />
              <PublicRoute
                authenticated={this.props.auth}
                path={routeCodes.FORGOT_PASSWORD}
                component={ForgotPassword}
                user={this.props.user}
                from={this.props.from}
              />
              <PublicRoute
                authenticated={this.props.auth}
                path={routeCodes.LANDING}
                component={Landing}
                user={this.props.user}
                from={this.props.from}
              />
              <Route path="*" render={() => <h3>No Content</h3>}/>
              {/* <Redirect to={routeCodes.LOGIN} /> */}
            </Switch>
          </div>
          {/* <Footer/> */}
        </div>
      </BrowserRouter>
    );
  }
}


function mapStateToProps(state) {
  return {
    loading: state.app.loading,
    user: state.app.user,
    auth: state.app.authenticated,
    from: state.app.nextRoute,
  };
}

// export default connect(mapStateToProps)(App);

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onGetUser: actions.getUser,
    setNextRoute: actions.setNextRoute,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);