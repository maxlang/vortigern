import * as React from 'react';
const _ = require('lodash');
const style = require('./style.css');
// https://github.com/PaulLeCam/react-leaflet/issues/45
import {Map, Marker, /*Popup,*/ TileLayer } from 'react-leaflet-universal';
import { divIcon } from 'leaflet-headless';
// import { PeopleConnected as People } from './people';
// import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { getUserLocations } from 'redux/modules/persontimelapse/index';
// import Slider from 'rc-slider';
// const emojiTree = require('emoji-tree');
// import Clock from './clock';
import * as geolib from 'geolib';

interface IProps {
  getUserLocations: typeof getUserLocations;
  locations: any;
  // from react-router TODO: why isn't this in router-props?
  location: {
    query: any;
  };
}

// @asyncConnect([{
//   promise: ({ store: { dispatch } }) => {
//     return dispatch(getUserLocations('maxwell.g.lang@gmail.com', moment().subtract(1, 'day'))); // TODO: user users
//   },
// },
// ])

interface IVideoState {
  time: number;
  prevTime: number;
  playing: boolean;
  duration: number;
  fps: number;
}

class Video extends React.Component<IProps, IVideoState> {

  public state = {
    prevTime: null,
    time: null,
    playing: false,
    duration: 10 * 1000, // default duration is 10s
    fps: 25, // default fps is 25
  };

  public componentWillMount() {
    this.props.getUserLocations('maxwell.g.lang@gmail.com',
    this.props.location.query.start && moment(this.props.location.query.start) || moment().subtract(1, 'day'),
    this.props.location.query.end && moment(this.props.location.query.end));
    console.log('this.props', this.props.location.query);

    if (this.props.location.query.duration) {
      this.setState({duration: _.toNumber(this.props.location.query.duration)});
    }
    if (this.props.location.query.fps) {
      this.setState({fps: _.toNumber(this.props.location.query.fps)});
    }
  }

  public componentWillReceiveProps(props) {
    if (props.locations && !this.state.time) {
      this.setSlider(this.getTimeRange(props).start);
      // this.play(props);
    }
  }

  // TODO: add timerange and bounds to state
  private getTimeRange(props = this.props) {
    const userLocations = _.filter(props.locations, {_index: 'locations'});
    const start = _.minBy(userLocations, (l) => l._source.timestamp)._source.timestamp;
    const end = _.maxBy(userLocations, (l) => l._source.timestamp)._source.timestamp;
    return {start, end};
  }

  private getBounds() {
    const minLat = _.minBy(this.props.locations, (l) => l._source.latitude)._source.latitude;
    const maxLat = _.maxBy(this.props.locations, (l) => l._source.latitude)._source.latitude;
    const minLon = _.minBy(this.props.locations, (l) => l._source.longitude)._source.longitude;
    const maxLon = _.maxBy(this.props.locations, (l) => l._source.longitude)._source.longitude;

    return [[minLat, minLon], [maxLat, maxLon]];
  }

  private getPositionAtTime(timestamp: number) {
    // console.log('unsorted', this.props.locations);
    const sortedUserLocations = _.orderBy(_.filter(this.props.locations, {_index: 'locations'}),
      [(l) => l._source.timestamp, (l) => l._source.recorded], ['asc', 'asc']);
    // console.log('sorted', sortedUserLocations);
    const nextLocationIdx = _.sortedIndexBy(sortedUserLocations, {_source: {timestamp}}, (l) => l._source.timestamp);
    const prevLocationIdx = nextLocationIdx - 1;

    // If it's before or after tracking, return null;
    if (prevLocationIdx < 0 || nextLocationIdx >= sortedUserLocations.length) {
      return null;
    }
    const prevTime = sortedUserLocations[prevLocationIdx]._source.timestamp;
    const prevLocation = {
      latitude: sortedUserLocations[prevLocationIdx]._source.latitude,
      longitude: sortedUserLocations[prevLocationIdx]._source.longitude,
    };
    const nextTime = sortedUserLocations[nextLocationIdx]._source.timestamp;
    const nextLocation = {
      latitude: sortedUserLocations[nextLocationIdx]._source.latitude,
      longitude: sortedUserLocations[nextLocationIdx]._source.longitude,
    };
    const timeRatio = (timestamp - prevTime) / (nextTime - prevTime);
    const distance = geolib.getDistanceSimple(prevLocation, nextLocation);
    const bearing = geolib.getBearing(prevLocation, nextLocation);
    const location = geolib.computeDestinationPoint(prevLocation, distance * timeRatio, bearing);
    return location;
  }

  private setSlider(timestamp) {
    this.setState({prevTime: this.state.time, time: timestamp});
  }

  private play(props = this.props) {
    if (this.state.playing) {
      return;
    }
    const fps = this.state.fps;

    const times = this.getTimeRange(props);
    this.setState({playing: true, time: times.start, prevTime: null});
    const timeIncrement = (times.end - times.start) / (this.state.duration / 1000) / fps;
    // 30 seconds
    const interval = setInterval(() => {
      const newTime = Math.min(this.state.time + timeIncrement, times.end);
      if (newTime === times.end) {
        clearInterval(interval);
        this.setState({playing: false});
      }
      this.setState({prevTime: this.state.time, time: newTime});
     }
    , 1000 / fps);
  }

  private getEmojis(timestamp: number) {
    const emojiLocations = _.filter(this.props.locations,
      (l) => l._index === 'emojis' && l._source.timestamp < timestamp);
    return emojiLocations;
  }

  public render() {
    if (!this.props.locations || !this.props.locations.length || !this.state.time) {
      return null;
    }
    // const timeRange = this.getTimeRange();
    const bounds = this.getBounds();
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

    // NOTE: hard to animate marker
    // - if animation uses transform it overwrites the icon positioning
    // - if animation is applied to innerhtml, then it's constantly readded
    const emojiClass = style.bigIcon + ' ' + style['animated-marker'];
    // const emojiSpanClass = '';
    // const getEmojiHtml = (e) => `<span class="${emojiSpanClass}">${e._source.emoji}</span>`;

    const emojiMarkers = _.map(this.getEmojis(this.state.time),
      (e) => (
        <Marker
          position={[e._source.point.lat, e._source.point.lon]}
          icon={divIcon({html: e._source.emoji, className: emojiClass, iconAnchor: [20, 30]})}
          key={e._id} />
        ),
      );

    // const attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
    //   ' <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
    //   ' Imagery © <a href="http://mapbox.com">Mapbox</a>';

    const attribution = 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.';

    // tslint:disable-next-line:max-line-length
    // const lighturl = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}';
    // const darkurl = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}';
    const url = 'http://tile.stamen.com/toner-lite/{z}/{x}/{y}@2x.png';

    // const setSlider = (v) => this.setSlider(v);
    const play = () => this.play();
    console.log('time', this.state.time);

    const location = this.getPositionAtTime(this.state.time);

    const marker = location ? (
      <Marker
        position={[location.latitude, location.longitude]}
        icon={divIcon({html: '😁', className: style.bigIcon, iconAnchor: [20, 30]})}
        />
      ) : null;

    // const slider = (
    //   <Slider
    //     className={style.slider}
    //     min={timeRange.start}
    //     max={timeRange.end}
    //     value={this.state.time}
    //     onChange={setSlider}/>
    // );

    // const playButton = <a style={{color: 'blue'}} href={null} onClick={play}>play</a>;

    // const clock = <time className={style.clock}>{moment(this.state.time).format('MMMM Do YYYY, h:mm:ss a')}</time>;
    const clockTime = moment(this.state.time).format('MMMM Do YYYY, h:mm:ss a');

    return (
      <div className={style.Video}>
        {this.state.playing ? <time className={style.clock}>{clockTime}</time> : null}
        <Map bounds={bounds} className={style.blah} zoomControl={false}>
          <TileLayer
             url={url}
             attribution={attribution}
             maxZoom={18}
             id={'mapbox.streets'}
             accessToken="pk.eyJ1IjoibWF4bGFuZyIsImEiOiJjamVrYXowdW0wZ3lqMzRsbDFuYWV5ejF2In0.wJcolR8UNs0SvJdPgwitsg"
             onLoad={play}
           />
          {marker}
          {emojiMarkers}
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
