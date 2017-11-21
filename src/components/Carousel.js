import React from 'react';

// transitionend event stuff
var transitions = {
  'transition': 'transitionend',
  'OTransition': 'oTransitionEnd',
  'MozTransition': 'transitionend',
  'WebkitTransition': 'webkitTransitionEnd'
};
var transitionEvent = 'NO_TRANSITION_EVENT';
var _elem = document.createElement('div');
var __t = null;

for (__t in transitions)
  if (_elem.style[__t] !== undefined)
      transitionEvent = transitions[__t];

if (transitionEvent == 'NO_TRANSITION_EVENT') {
  var transEvent = document.createEvent('Event');
  transEvent.initEvent(transitionEvent, true, false);
}

// helper mixins

function asNodeList() {
  this.forEach = function(cb) {
      [].forEach.call(this, cb);
  };
  this.css = function(cssObj) {
      this.forEach(function(node) {
          for (var style in cssObj) node.style[style] = cssObj[style];
      });
  };
  return this;
}

// Carousel stuff
function handleCarousel() {
  var carousels = asNodeList.call(document.querySelectorAll('[data-carousel]'));

  carousels.forEach(function(elem) {
    var current = 0;
    var carouselSlide = elem.querySelector('.carousel__slide');
    var carouselSlideItems = asNodeList.call(
        carouselSlide.querySelectorAll('.carousel__slide-item')
    );

    carouselSlide.style.width = (carouselSlideItems.length * 100) + '%';
    carouselSlideItems.css({
        width: (100 / carouselSlideItems.length) + '%'
    });
    carouselSlideItems.forEach(function(item) {
        item.style.backgroundImage = item.getAttribute('data-background');
    });

    elem.querySelector('.carousel__controller__nav--left')
        .addEventListener('click', function(e) {
            current--;
            slide(current);
        });
    elem.querySelector('.carousel__controller__nav--right')
        .addEventListener('click', function(e) {
            current++;
            slide(current);
        });

    function slide(place) {
        if (current < 0) current = carouselSlideItems.length - 1;
        else if (current >= carouselSlideItems.length) current = 0;
        carouselSlide.style.left = -(current * 100) + '%';

        if (transitionEvent == 'NO_TRANSITION_EVENT')
            elem.dispatchEvent(transEvent);
    }
  })
}

class Carousel extends React.Component {
  componentDidMount() {
    handleCarousel();
  }
  render() {
    return (
      <div data-carousel="blah" className="carousel">
        <div className="carousel__slide clearfix">
          <div className="carousel__slide-item">
            {/* <p className="hero__slogan">Become the most organized band in town!</p> */}
            <img className="carousel__img" src="http://lorempixel.com/1600/1000/abstract/1/" />
            {/* <img className="carousel__img" src="../../assets/img/music-planning.jpeg" /> */}
          </div>
          <div className="carousel__slide-item">
            {/* <p className="hero__slogan">Upload Your StagePlot</p> */}
            <img className="carousel__img"src="http://lorempixel.com/1600/1000/abstract/2/"/>
            {/* <img className="carousel__img" src="../../assets/img/stage-plot.jpeg" /> */}
          </div>
          <div className="carousel__slide-item">
            {/* <p className="hero__slogan">Keep Track Of Your Gear</p> */}
            <img src="http://lorempixel.com/1600/1000/abstract/3/" />
            {/* <img className="carousel__img" src="../../assets/img/gear.jpeg  " /> */}
          </div>
        </div>
        <div className="carousel__controller">
          <div className="carousel__controller__nav">
            <div className="carousel__controller__nav--left">
                <i className="icon-chevron-sign-left"></i>
            </div>
            <div className="carousel__controller__nav--right">
                <i className="icon-chevron-sign-right"></i>
            </div>
          </div>
        </div>
    </div>
    )
  }
}

export default Carousel;
