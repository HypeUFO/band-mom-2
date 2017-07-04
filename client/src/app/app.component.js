import React, { Component } from 'react';
import Landing from '../landing/landing.component';
import Header from '../header/header.component';
import logo from '../logo.svg';
import './app.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Header />
        <Landing />
      </div>
    );
  }
}

export default App;
