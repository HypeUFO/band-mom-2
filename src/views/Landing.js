import React from 'react';
import Hero from '../components/Hero';
import Carousel from '../components/Carousel';
import Header from '../components/Global/Header';

const Landing = (props) => {
  return (
    <div className="landing">
      <Header />
      <Hero>
        <p className="hero__slogan">Become the most organized band in town!</p>
        <Carousel />
        <p className="hero__login__reminder">
          Already have an account?
          <a className="hero__login__link" href="#"
          //onTouchTap={handleLoginModal}
          >
            Login here
          </a>
        </p>
      </Hero>
    </div>
  )
}

export default Landing;