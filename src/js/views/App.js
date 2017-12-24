import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/auth.actions';
// import PropTypes from 'prop-types';

import history from '../history';
import {Router, Switch, Route, Redirect} from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import EventList from './EventList';
import EventDetails from './EventDetails';
import BandDashboard from './BandDashboard';
import UserDashboard from './UserDashboard';
// import NotFound from './NotFound';
import Header from '../components/Global/Header';
// import Footer from '../components/Global/Footer';
import Loader from '../components/Global/Loader';

import {routeCodes} from '../route-codes';

import { auth } from '../config/fire';



class App extends Component {

    componentDidMount() {
      auth.onAuthStateChanged((user) => {
        // if (user) {
          this.props.onGetUser({ user });
        // }
      });
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
    // const {
    //   user,
    // } = this.props;

    const user  = auth.currentUser;

    if(user) {
      const userId = user.uid;
    return (
      <Router history={history}>
        <div className="app">
          { header }
          <div className='page'>
          { this.props.loading ? <Loader /> : null }
            <Switch>
              <Route path={routeCodes.EVENT_DETAILS} component={EventDetails}/>
              <Route path={routeCodes.EVENT_LIST} component={EventList}/>
              <Route path={routeCodes.BAND_DASHBOARD} component={BandDashboard}/>
              <Route path={routeCodes.USER_DASHBOARD} component={UserDashboard}/>
              {/* <Redirect path="*" to={routeCodes.USER_DASHBOARD}/> */}
              <Redirect path="*" to={ `/${userId}/dashboard` } />
            </Switch>
          </div>
          {/* <Footer/> */}
        </div>
      </Router>
    );
  } else {
  return (
    <Router history={history}>
      <div className="app">
        { header }
        <div className='page'>
        { this.props.loading ? <Loader /> : null }
          <Switch>
            <Route exact path={routeCodes.LANDING} component={Landing}/>
            <Route exact path={routeCodes.LOGIN} component={Login}/>
            <Route path={routeCodes.REGISTER} component={Register}/>
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
}

function mapStateToProps(state) {
  return {
    loading: state.app.loading,
    user: state.app.user,
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
