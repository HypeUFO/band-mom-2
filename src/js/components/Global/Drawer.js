import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { auth } from '../../config/fire';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { signOut } from '../../actions/auth.actions';

class Drawer extends Component {
  static propTypes = {
    // userName: PropTypes.string,
    show: PropTypes.bool,
    toggle: PropTypes.func,
  }

  static defaultProps = {
    show: false,
  }

  render() {
    const {
      user,
    } = this.props;

    let activeClass = (this.props.show) ? 'drawer--active' : '';

    let bandsUrl;
    let profileUrl;
    let dashboardUrl;
    let eventsUrl;
    let settingsUrl;
    let messagesUrl

    if (user) {
      // let bandsUrl = `/${userName}/bands`;
      bandsUrl = `/${user.uid}/bands`;
      profileUrl = `/${user.uid}/profile`;
      dashboardUrl = `/${user.uid}/dashboard`;
      eventsUrl = `/${user.uid}/events`;
      settingsUrl = `/${user.uid}/settings`;
      messagesUrl = `/${user.uid}/messages`;
    } else {
      bandsUrl = '';
      profileUrl = '';
      dashboardUrl = '';
      eventsUrl = '';
      settingsUrl = '';
      messagesUrl= '';
    }
  	return (
	    <div className={`drawer ${activeClass} ${this.props.className}`} style={this.props.style}>
      <div className="drawer__header" style={{height: 60}}>
	    	<Link to={ dashboardUrl }  style={{textDecoration: 'none'}}>
	  			<h2 className="drawer__logo">BandMom</h2>
	  		</Link>
        </div>
	  		<i className="drawer__close material-icons clr-light" onClick={ this.props.toggle }>close</i>
        <ul className="drawer__list">
          <li className="drawer__item">
              <Link to={ dashboardUrl } onClick={ this.props.toggle }>Dashboard</Link>
          </li>
          <li className="drawer__item">
              <Link to={ profileUrl } onClick={ this.props.toggle }>Profile</Link>
          </li>
          <li className="drawer__item">
              <Link to={ bandsUrl } onClick={ this.props.toggle }>Bands</Link>
          </li>
          <li className="drawer__item">
              <Link to={ eventsUrl } onClick={ this.props.toggle }>Events</Link>
          </li>
          <li className="drawer__item">
              <Link to={ messagesUrl } onClick={ this.props.toggle }>Messages</Link>
          </li>
          <li className="drawer__item">
              <Link to={ settingsUrl } onClick={ this.props.toggle }>Settings</Link>
          </li>
          <li className="drawer__item">
              <Link to='#' onClick={ this.props.signOut }>
                Sign Out
              </Link>
          </li>
        </ul>
			</div>
  	);
  }
}

function mapStateToProps(state) {
  return {
    // loading: state.app.loading,
    user: state.app.user,
    // auth: state.app.authenticated,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    signOut: signOut,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
