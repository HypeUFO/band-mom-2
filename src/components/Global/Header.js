import React, { Component } from 'react';
import Drawer from './Drawer';
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
      <header className="header">
        <i className="material-icons show-drawer" onClick={this.toggleDrawer}>&#xE8EE;</i>
        <a href="/"><h1 className="logo">BandMom</h1></a>
        <Drawer
          // userName={ userName }
          show={ this.state.showDrawer }
          toggle={ this.toggleDrawer }
        />
      </header>
    )
  }
}
