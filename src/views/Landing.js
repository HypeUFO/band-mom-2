import React from 'react';
import Hero from '../components/Hero';
import Carousel from '../components/Carousel';
import Header from '../components/Global/Header';

const Landing = (props) => {
  return (
    <div className="landing">
      <Header />
      <Hero>
        <Carousel />
        <div className="hero__login__container">
        <p className="hero__slogan">Become the most organized band in town!</p>
          <p className="hero__login__reminder">
            Already have an account?
            <br />
            <a className="hero__login__link" href="#"
            //onTouchTap={handleLoginModal}
            >
              Login here
            </a>
          </p>
        </div>
      </Hero>
    </div>
  )
}

export default Landing;