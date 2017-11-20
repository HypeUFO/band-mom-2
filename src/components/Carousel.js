import React from 'react';

class Carousel extends React.Component {
  componentDidMount() {
    handleCarousel();
  }
  render() {
  return (
    <div data-carousel="blah" className="Carousel">
    <div className="Carousel-Slide clearfix">
        <div className="Carousel-Slide-item"><img src="http://lorempixel.com/1600/1000/abstract/1/" /></div>
        <div className="Carousel-Slide-item"><img src="http://lorempixel.com/1600/1000/abstract/2/"/></div>
        <div className="Carousel-Slide-item"><img src="http://lorempixel.com/1600/1000/abstract/3/" /></div>
        {/* <div className="Carousel-Slide-item" data-background="url(http://lorempixel.com/1600/1000/abstract/4/)"></div> */}
    </div>
    <div className="Carousel-Controller">
        <div className="Carousel-Controller-Nav">
            <div className="Carousel-Controller-Nav-left">
                <i className="icon-chevron-sign-left"></i>
            </div>
            <div className="Carousel-Controller-Nav-right">
                <i className="icon-chevron-sign-right"></i>
            </div>
        </div>
    </div>
</div>
  )
}
}

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
  var carouselSlide = elem.querySelector('.Carousel-Slide');
  var carouselSlideItems = asNodeList.call(
      carouselSlide.querySelectorAll('.Carousel-Slide-item')
  );

  carouselSlide.style.width = (carouselSlideItems.length * 100) + '%';
  carouselSlideItems.css({
      width: (100 / carouselSlideItems.length) + '%'
  });
  carouselSlideItems.forEach(function(item) {
      item.style.backgroundImage = item.getAttribute('data-background');
  });

  elem.querySelector('.Carousel-Controller-Nav-left')
      .addEventListener('click', function(e) {
          current--;
          slide(current);
      });
  elem.querySelector('.Carousel-Controller-Nav-right')
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

export default Carousel;