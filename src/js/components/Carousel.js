import React from 'react';
import Slider from 'react-slick';

export default class Carousel extends React.Component {
  constructor(props) {
    super(props)

    this.settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
    };
  }

  render() {
    return (
      <Slider {...this.settings}>
        { this.props.children }
      </Slider>
    );
  }
}