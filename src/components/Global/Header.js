import React, { Component } from 'react';

const Header = () => {
  return (
    <header className="header">
    <a href="/"><h1 className="logo">BandMom</h1></a>
    <ul id="header__menu">
    {/* <li><a href="/about">About</a></li> */}
    {/* <li><a href="/news">News</a></li> */}
    {/* <li><a href="/register">Sign Up</a></li> */}
    <li><a href="/login">Log In</a></li>
</ul>
<label htmlFor="show-menu" className="show-menu">|||</label>
<input type="checkbox" id="show-menu" role="button"
onClick={() => {
  const menu = document.querySelector('#header__menu');
  menu.classList.toggle('show');
}}/>
    </header>
  )
}

export default Header;