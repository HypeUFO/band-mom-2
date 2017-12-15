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
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickAway = this.handleClickAway.bind(this);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickAway(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState(prevState => ({
        showDrawer: false,
      }))
      document.removeEventListener('click', this.handleClickAway);
    }
  }

  toggleDrawer() {
    this.setState({
      showDrawer: !this.state.showDrawer
    });
    document.addEventListener('click', this.handleClickAway);
  }

  render() {
    return (
      <header className="header">
        <i className="material-icons show-drawer" onClick={this.toggleDrawer}>&#xE8EE;</i>
        <a href="/"><h1 className="logo">BandMom</h1></a>
        <div ref={this.setWrapperRef}>
        <Drawer
          // userName={ userName }
          show={ this.state.showDrawer }
          toggle={ this.toggleDrawer }
        />
        </div>
      </header>
    )
  }
}
