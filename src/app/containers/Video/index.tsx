import * as React from 'react';
// const _ = require('lodash');
const style = require('./style.css');
// https://github.com/PaulLeCam/react-leaflet/issues/45
import {Map, /*Marker, Popup,*/ TileLayer } from 'react-leaflet-universal';
// import { divIcon } from 'leaflet-headless';
// import { PeopleConnected as People } from './people';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { getUserLocations } from 'redux/modules/persontimelapse/index';
import Slider from 'rc-slider';

// const emojiTree = require('emoji-tree');

interface IProps {
  getUserLocations: typeof getUserLocations;
  locations: any;
}

@asyncConnect([{
  promise: ({ store: { dispatch } }) => {
    return dispatch(getUserLocations('maxwell.g.lang@gmail.com', moment().subtract(1, 'day'))); // TODO: user users
  },
},
])
class Video extends React.Component<IProps, any> {

  public componentWillMount() {
    this.props.getUserLocations('maxwell.g.lang@gmail.com', moment().subtract(1, 'day'));
  }

  public render() {
    console.log(this.props.locations);
    // const { people, emojis } = this.props;

    // // console.log('EMOJIS', emojis);

    // // const max = _.find(people.people, (v) => v.key.startsWith('max'));
    // // const sharon = _.find(people.people, (v) => v.key.startsWith('sharon'));

    // // const lastPosition = _.get(max, 'last_location.hits.hits[0]._source.point', { lat: 0, lon: 0 });
    // // const lastPositionSharon = _.get(sharon, 'last_location.hits.hits[0]._source.point', { lat: 0, lon: 0 });
    // // const position = [lastPosition.lat, lastPosition.lon];
    // // const positionSharon = [lastPositionSharon.lat, lastPositionSharon.lon];

    // const lat = 'last_location.hits.hits[0]._source.point.lat';
    // const lon = 'last_location.hits.hits[0]._source.point.lon';

    // people.people = _.reject(people.people,
    //   (p) => _.get(p, 'last_location.hits.hits[0]._source.user') === 'sharon.e.lee@gmail.com',
    // );

    // // TODO: include emoji in bounds
    // const bounds = [
    //   [_.get(_.minBy(people.people, lat), lat), _.get(_.minBy(people.people, lon), lon)],
    //   [_.get(_.maxBy(people.people, lat), lat), _.get(_.maxBy(people.people, lon), lon)],
    // ];

    // const emojiMarkers = _.map(emojis.data,
    //   (e, i) => (
    //     <Marker
    //       position={[e._source.point.lat, e._source.point.lon]}
    //       icon={divIcon({html: e._source.emoji, className: style.bigIcon, iconAnchor: [20, 30]})}
    //       key={i} />
    //     ),
    //   );

    const attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
      ' <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
      ' Imagery © <a href="http://mapbox.com">Mapbox</a>';

    // tslint:disable-next-line:max-line-length
    // const lighturl = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}';
    const darkurl = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}';

    return (
      <div className={style.Video}>
        <Slider />
        <Map bounds={[[40.5, -74], [41, -73.7]]} className={style.blah}>
          <TileLayer
             url={darkurl}
             attribution={attribution}
             maxZoom={18}
             id={'mapbox.streets'}
             accessToken="pk.eyJ1IjoibWF4bGFuZyIsImEiOiJjamVrYXowdW0wZ3lqMzRsbDFuYWV5ejF2In0.wJcolR8UNs0SvJdPgwitsg"
           />
        </Map>
      </div>
    );
  }
}

const VideoConnected = connect(
  (state) => ({ locations: state.userlocations.data }),
  {
    getUserLocations,
  },
)(Video);

export { VideoConnected }

// tslint:disable-next-line
// [ { "key": "maxwell.g.lang@gmail.com", "doc_count": 18, "last_location": { "hits": { "total": 18, "max_score": null, "hits": [ { "_index": "locations", "_type": "location", "_id": "AWFJh9s858UbSp3UoN8n", "_score": null, "_source": { "user": "maxwell.g.lang@gmail.com", "latitude": 37.33056973, "longitude": -122.0288791, "accuracy": 10, "point": { "lat": 37.33056973, "lon": -122.0288791 }, "timestamp": 1517357095694, "recorded": 1517357095701 }, "sort": [ 1517357095694 ] } ] } }, "latest_recorded": { "value": 1517357095694, "value_as_string": "2018-01-31T00:04:55.694Z" } }, { "key": "sharon.e.lee@gmail.com", "doc_count": 14, "last_location": { "hits": { "total": 14, "max_score": null, "hits": [ { "_index": "locations", "_type": "location", "_id": "AWFFb3ZX58UbSp3UoN8P", "_score": null, "_source": { "user": "sharon.e.lee@gmail.com", "latitude": 40.7483, "longitude": -73.9846, "accuracy": 20, "point": { "lat": 40.7483, "lon": -73.9846 }, "timestamp": 1517201988000, "recorded": 1517288388062 }, "sort": [ 1517201988000 ] } ] } }, "latest_recorded": { "value": 1517201988000, "value_as_string": "2018-01-29T04:59:48.000Z" } } ]
