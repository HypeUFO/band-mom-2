import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Header extends Component {
  static propTypes = {
    user: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      showDrawer: false,
    };
    this.toggleDrawer = this.toggleDrawer.bind(this)
  }

  toggleDrawer() {
    this.setState({
      showDrawer: !this.state.showDrawer
    });
  }

  render() {
    return (
      <header className="header--landing">
        <a href="/"><h1 className="logo">BandMom</h1></a>
        <ul id="header__menu">
        <li><a href="/login">Log In</a></li>
        </ul>
      </header>
    )
  }
}
