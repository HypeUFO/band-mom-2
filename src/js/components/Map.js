// import React from 'react';
// import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

// const google = window.google;
// let geocoder = new google.maps.Geocoder();

// function center(address) {
//   console.log(address);
//   geocoder.geocode({'address': address}, function(results, status) {
//     if (status == 'OK') {
//       console.log('Geocode was successful ' + JSON.stringify(results));
//       return results[0].geometry.location;
//     } else {
//       console.log('Geocode was not successfull because ' + status)
//     }
//   })
// }

// let mapCenter = center('4 Paag Lane Little Silver NJ 07739');

// const Map = withGoogleMap((props) =>
//   <GoogleMap
//     defaultZoom={8}
//     defaultCenter={ {lat: -34.397, lng: 150.644} }
//     // defaultCenter={ center('4 Paag Lane Little Silver NJ 07739') }
//   >
//     {/* {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />} */}
//   </GoogleMap>
// )

// // const Map = withScriptjs(withGoogleMap((props) =>
// //   <GoogleMap
// //     defaultZoom={8}
// //     // defaultCenter={ {lat: -34.397, lng: 150.644} }
// //     defaultCenter={ center('4 Paag Lane Little Silver NJ 07739') }
// //   >
// //     {/* {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />} */}
// //   </GoogleMap>
// // ))

// export default Map;

import { connect } from 'react-redux';
const React = require('react')
const PropTypes = require('prop-types')
// import Reflux from 'reflux'
// const Radium = require('radium')

class Map extends React.Component {

    constructor(props) {
        super(props)
        this.loadJS = this.loadJS.bind(this)
        this.initMap = this.initMap.bind(this)
        this.center = this.center.bind(this);
        this.google = window.google;
        this.geocoder = new this.google.maps.Geocoder();
        this.initMap = this.initMap.bind(this);
    }

    center(address) {
      console.log(address);
      this.geocoder.geocode({'address': address}, function(results, status) {
        if (status == 'OK') {
          console.log('Geocode was successful ' + JSON.stringify(results));
          return results[0].geometry.location;
        } else {
          console.log('Geocode was not successfull because ' + status)
        }
      })
    }

    componentDidMount() {
        if (typeof this.google === 'object' && typeof this.google.maps === 'object') {
            this.initMap()
        } else {
            this.loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCGaFX5PzypU4uZ2RT-l-OU9A6-6aIxmBk&callback=initMap')
        }
    }

    // https://github.com/filamentgroup/loadJS/blob/master/loadJS.js
    loadJS(src) {
        var ref = window.document.getElementsByTagName("script")[0];
        var script = window.document.createElement("script");
        script.src = src;
        script.async = true;
        ref.parentNode.insertBefore(script, ref);
    }

    initMap() {
        var map = new this.google.maps.Map(this.refs.map, {
          // center: this.center('4 Pennsylvania Plaza, New York, NY 10001'),
          center: {"lat":40.7505621,"lng":-73.99347089999998},
          zoom: 15
        })
        var marker = new this.google.maps.Marker({
          position: {"lat":40.7505621,"lng":-73.99347089999998},
          map: map
        });
        var contentString = `<div>Test Info WIndow</div>`

        var infowindow = new this.google.maps.InfoWindow({
          content: contentString
        });
        marker.addListener('mouseover', function() {
          infowindow.open(map, marker);
        });
        marker.addListener('mouseout', function() {
          infowindow.close();
        });
    }

    render() {
        return (
        <div ref='map' style={{height: 250, width: '100%'}}></div>
      )
    }

}

function mapStateToProps(state) {
  return {
    gig: state.gigs.activeGig,
    isLoading: state.app.loading,
    notification: state.notification,
  };
}

export default connect(mapStateToProps)(Map);