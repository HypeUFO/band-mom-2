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
    // const {
    //   userName,
    // } = this.props;

  	let activeClass = (this.props.show) ? 'drawer--active' : '';
    // let bandsUrl = `/${userName}/bands`;
    let bandsUrl = `/bands`;
    let profileUrl = `/profile`;
    // let messagesUrl = `/messages`;
    // let logOutUrl = `/logout`;
  	return (
	    <div className={`drawer ${activeClass} ${this.props.className}`} style={this.props.style}>
	    	<Link to="/dashboard" style={{textDecoration: 'none'}}>
	  			<h2 className="drawer__logo">BandMom</h2>
	  		</Link>
	  		<i className="drawer__close material-icons clr-light" onClick={ this.props.toggle }>close</i>
        <ul className="drawer__list">
          <li className="drawer__item">
              <Link to={ bandsUrl } onClick={ this.props.toggle }>Bands</Link>
          </li>
          <li className="drawer__item">
              <Link to={ profileUrl } onClick={ this.props.toggle }>Profile</Link>
          </li>
          <li className="drawer__item">
              <Link to={ profileUrl } onClick={ this.props.toggle }>Messages</Link>
          </li>
          <li className="drawer__item">
              <Link to='#'
              //   onClick={ () => {
              //   auth.signOut().then(() => {
              //     console.log('Sign-out successful');
              //   }).catch((err) => {
              //     console.log(err);
              //   });
              // }}
                onClick={ this.props.signOut }
              >
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
    loading: state.app.loading,
    user: state.app.user,
    auth: state.app.authenticated,
  };
}

// export default connect(mapStateToProps)(App);

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    signOut: signOut,
    },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
