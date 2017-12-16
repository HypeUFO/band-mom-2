import React, { Component } from 'react';

export default class Loader extends Component {
  render() {
    return (
      <div className="loader__wrapper">
      <div className="loader__overlay"></div>
        <div className="loader">
          <div className="loader__three-balls">
            <div className="loader__ball loader__ball1"></div>
            <div className="loader__ball loader__ball2"></div>
            <div className="loader__ball loader__ball3"></div>
          </div>
        </div>
      </div>
    );
  }
}
