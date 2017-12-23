import React, {Component} from 'react';
import {connect} from 'react-redux';
// import PropTypes from 'prop-types';
// import {Provider} from 'react-redux';
import history from '../history';
import {Router, Switch, Route, Redirect} from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import EventList from './EventList';
import EventDetails from './EventDetails';
import BandDashboard from './BandDashboard';
// import NotFound from './NotFound';
import Header from '../components/Global/Header';
// import Footer from '../components/Global/Footer';
import Loader from '../components/Global/Loader';

import {routeCodes} from '../route-codes';

class App extends Component {
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
              <Route path={routeCodes.EVENT_DETAILS} component={EventDetails}/>
              <Route path={routeCodes.EVENT_LIST} component={EventList}/>
              <Route path={routeCodes.BAND_DASHBOARD} component={BandDashboard}/>
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

function mapStateToProps(state) {
  return {
    loading: state.app.loading
  };
}

export default connect(mapStateToProps)(App);
