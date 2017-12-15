import React, { Component } from 'react';

export default class Footer extends Component {
  render() {
    const containerStyle = {
      position: 'fixed',
      bottom: 0,
      right: 0,
    };
    const textStyle = {
      color: '#aaa',
      fontSize: '0.8rem',
      opacity: '0.6',
      padding: '1rem',
      margin: 0,
      lineHeight: 1,
    };
    return (
      <div style={ containerStyle }>
        <p style={ textStyle }>
          { process.env.NODE_ENV } v{ process.env.NPM_PACKAGE_VERSION }
        </p>
      </div>
    )
  }
}
