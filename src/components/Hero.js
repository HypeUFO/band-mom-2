import React from 'react';
// import Header from '../header/header';
import Carousel from './Carousel';

const Hero = (props) => {
    return (
        <div className="hero">
            {/*<Header />*/}
            <p className="hero__slogan">Become the most organized band in town!</p>
            <Carousel />
            {/* <RaisedButton label="Join Now" primary={true} style={style} /> */}
            <p className="hero__login__reminder">Already have an account? <a className="hero__login__link" href="#"
            //onTouchTap={handleLoginModal}
            >
            Login here</a></p>
        </div>
    )
}

export default Hero;