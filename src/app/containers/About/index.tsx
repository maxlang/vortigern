import * as React from 'react';
const style = require('./style.css');
// https://github.com/PaulLeCam/react-leaflet/issues/45
import {Map, Marker, Popup, TileLayer } from 'react-leaflet-universal';
import { divIcon } from 'leaflet-headless';
import { PeopleConnected as People } from './people';
import { getPeople } from 'modules/people';
import { asyncConnect } from 'redux-connect';

// const layers = require('../../node_modules/leaflet/dist/images/layers.png');
// const markerIcon2x = require('../../node_modules/leaflet/dist/images/marker-icon-2x.png');
// const markerIcon = require('../../node_modules/leaflet/dist/images/marker-icon.png');
// const markerShadow = require('../../node_modules/leaflet/dist/images/marker-shadow.png');

@asyncConnect([{
  promise: ({ store: { dispatch } }) => {
    return dispatch(getPeople());
  },
}])
class About extends React.Component<any, any> {
  public render() {

    const icon = divIcon({
      html: '🔥',
      className: style.bigIcon,
      bgPos: [-20, -20],
    });

    const position = [51.505, -0.09];
    return (
      <div className={style.About}>
        <h4>About</h4>
        <People/>
        <Map center={position} zoom={13} className={style.blah}>
          <TileLayer
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
           />
          <Marker position={position} icon={icon}>
            <Popup>
               <span>A pretty CSS3 popup.<br />Easily customizable.</span>
            </Popup>
          </Marker>
        </Map>
      </div>
    );
  }
}

export { About }
