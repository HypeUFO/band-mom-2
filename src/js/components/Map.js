import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  connect
} from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';

class Map extends Component {

  constructor(props) {
    super(props)
    this.loadJS = this.loadJS.bind(this)
    this.initMap = this.initMap.bind(this)
    this.buildMap = this.buildMap.bind(this);
    this.google = window.google;
    this.geocoder = new this.google.maps.Geocoder();
    this.initMap = this.initMap.bind(this);
    this.geocodeAddress = this.geocodeAddress.bind(this);
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

  geocodeAddress(address) {
    this.geocoder.geocode({
      'address': address
    }, function (results, status) {
      if (status == 'OK') {
        console.log('Geocode was successful ' + JSON.stringify(results));
        return results[0].geometry.location;
      } else {
        console.log('Geocode was not successfull because ' + status)
      }
    })

  }


  buildMap(map, address, event) {
    const pinSymbol = {
      path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
      fillColor: '#FFF',
      fillOpacity: 1,
      strokeColor: '#190999',
      strokeWeight: 2,
      scale: 1
    };

    this.geocoder.geocode({
      'address': address
    }, function (results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        const marker = new this.google.maps.Marker({
          position: results[0].geometry.location,
          map,
          icon: pinSymbol,
        });
        marker.addListener('click', function () {
          infowindow.open(map, marker);
          const el = document.querySelector('.gm-style-iw');
          el.parentNode.removeChild(el.previousElementSibling);
          el.parentElement.style.background = 'white';
          el.parentElement.style.borderRadius = '10px';
          el.parentElement.style.overflow = 'auto';
        });
        marker.addListener('blur', function () {
          infowindow.close();
        }, true);
        var contentString = (`
            <div id="iw-container">
              <div class="iw-title">${event.venue} - ${moment(event.date).format('MM/DD/YY')}</div>
              <div class="iw-content">
                <div><span>Venue: </span>${event.venue}</div>
                <div><span>Date: </span>${moment(event.date).format('MM/DD/YY')}</div>
                <div><span>Address: </span><a href="http://maps.google.com/?q=${event.address}" target="_blank">${event.address}</a></div>
                <div><span>Show Time: </span>${event.showTime}</div>
                <div><span>Load In: </span>${event.loadIn}</div>
              </div>
            </div>
          `)

        var infowindow = new this.google.maps.InfoWindow({
          content: contentString
        });

      } else {
        console.log('Geocode was not successfull because ' + status)
      }
    })
  }

  initMap() {
    const mapOptions = {
      styles: [
        {
            "featureType": "all",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "hue": "#7F4FFF"
                },
                {
                    "saturation": "0"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#e8b8f9"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels",
            "stylers": [
                {
                    "color": "#ff0000"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    // "color": "#4B0BBB",
                    "color": "#380988"
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                },
                {
                    "color": "#a02aca"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "color": "#2e093b"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "labels.text",
            "stylers": [
                {
                    "color": "#190099"
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#190099"
                }
            ]
        },
        {
            "featureType": "landscape.natural.landcover",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "color": "#58176e"
                }
            ]
        },
        {
            "featureType": "landscape.natural.landcover",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 45
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "color": "#7F4FFF"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#d180ee"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "color": "#7F4FFF"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                },
                {
                    "color": "#ff0000"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text",
            "stylers": [
                {
                    "color": "#a02aca"
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#190099"
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "hue": "#bc00ff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#b79cff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#190099",
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#000033"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000033"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "color": "#b79cff"
                }
            ]
        }
    ],
    zoom: 14,
    };

    const map = new this.google.maps.Map(this.refs.map, mapOptions)
    this.buildMap(map, this.props.event.address, this.props.event)
  }

  render() {
    return (
      <div className="map__container">
        <div
          ref = 'map'
          className = "map"
        >
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    event: state.events.activeEvent,
    isLoading: state.app.loading,
    notification: state.notification,
  };
}

export default connect(mapStateToProps)(Map);