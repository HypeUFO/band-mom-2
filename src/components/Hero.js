import React from 'react';
// import Header from '../header/header';
import Carousel from './Carousel';

const Hero = (props) => {
    return (
        <div className="hero">
            {props.children}
        </div>
    )
}

export default Hero;