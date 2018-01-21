import React from "react";
import Slider from "react-slick";

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: this.props.slidesToShow || 4,
      slidesToScroll: 1
    };
  }

  render() {
    let sliderClass = "";
    if (this.props.children.length < this.settings.slidesToShow) {
      sliderClass += "slick-slider--no-arrows";
    }

    return (
      <Slider {...this.settings} className={sliderClass}>
        {this.props.children}
      </Slider>
    );
  }
}
