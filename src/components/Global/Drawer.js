import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { routeCodes } from '../../route-codes';

export default class Drawer extends Component {
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
      userName,
    } = this.props;
  	let activeClass = (this.props.show) ? 'drawer--active' : '';
    // let bandsUrl = `/${userName}/bands`;
    let bandsUrl = `/bands`;
    let profileUrl = `/profile`;
  	return (
	    <div className={"drawer " + activeClass}>
	    	<Link to={ bandsUrl }>
	  			<h3 className="drawer__logo">BandMom</h3>
	  		</Link>
	  		<i className="drawer__close material-icons clr-light" onClick={ this.props.toggle }>close</i>
        <ul className="drawer__list">
          {/* <li className="drawer__item drawer__item--header"><h2>Site</h2></li> */}
          <li className="drawer__item">
            {/* <h4> */}
              <Link to={ bandsUrl } onClick={ this.props.toggle }>Bands</Link>
            {/* </h4> */}
          </li>
          <li className="drawer__item">
            {/* <h4> */}
              <Link to={ profileUrl } onClick={ this.props.toggle }>Profile</Link>
            {/* </h4> */}
          </li>
          <li className="drawer__item">
            {/* <h4> */}
              <Link to={ profileUrl } onClick={ this.props.toggle }>Messages</Link>
            {/* </h4> */}
          </li>
        </ul>
			</div>
  	);
  }
}
