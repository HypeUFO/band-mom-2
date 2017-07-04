import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

import './carousel.css';

const imgStyle = {
  width: '100%',
  // height: '100%'
  height: 350
}

const slideContainer = {
  height: 350
}

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const Carousel = () => (
  <div style={{width: '70%', margin: 'auto', marginTop: 30, marginBottom: 15}}>
  <AutoPlaySwipeableViews slideStyle={{overflow: 'hidden'}}>
    <div style={slideContainer}>
      <div className="slide slide1"></div>
      <div className="carousel-caption">
        <h1>Guided Planning</h1>
        <p>Step by step instructions</p>
      </div>
    </div>
    <div style={slideContainer}>
    <div className="slide slide2" style={imgStyle}></div>
      <div className="carousel-caption">
          <h1>Save Your Stage Plot</h1>
          <p>It will be here when you need it!</p>
          {/*<p><a href="#signupModal" data-toggle="modal" className="btn btn-primary join-btn">Join Now</a></p>*/}
      </div>
    </div>
    <div style={slideContainer}>
    <div className="slide slide3"></div>
    <div className="carousel-caption">
        <h1>List the Gear You Need</h1>
        <p>Organize Your Purchases</p>
        {/*<p><a href="#signupModal" data-toggle="modal" className="btn btn-primary join-btn">Join Now</a></p>*/}
      </div>
    </div>
  </AutoPlaySwipeableViews>
  </div>
);

export default Carousel;