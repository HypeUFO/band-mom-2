import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Carousel from '../carousel/carousel.component';
// import Header from '../header/header';
import './landing.css';


const style = {
  margin: 12,
};

const Landing = (props) => {
    return (
        <div>
            {/*<Header />*/}
            <p id="websiteSlogan">Become the most organized band in town!</p>
            <Carousel />
            <RaisedButton label="Join Now" primary={true} style={style} />
            <p>Already have an account? <a href="#"
            //onTouchTap={handleLoginModal}
            >
            Login here</a></p>
        </div>
    )
}

export default Landing;