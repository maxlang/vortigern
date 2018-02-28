import * as React from 'react';
const _ = require('lodash');
const style = require('./style.css');
// https://github.com/PaulLeCam/react-leaflet/issues/45
import {Map, Marker, Popup, TileLayer } from 'react-leaflet-universal';
import { divIcon } from 'leaflet-headless';
// import { PeopleConnected as People } from './people';
import { getPeople } from 'modules/people';
import { asyncConnect } from 'redux-connect';
import { IPeople, IPeopleAction } from 'models/people';
// import { connect } from 'react-redux';

// import * as moment from 'moment';
import { emojisAction } from 'redux/modules/emojis';

const emojiTree = require('emoji-tree');

interface IProps {
  people: IPeople;
  getPeople: Redux.ActionCreator<IPeopleAction>;
  emojis: any;
}

@asyncConnect([{
  promise: ({ store: { dispatch } }) => {
    return dispatch(getPeople());
  },
},
{
  promise: ({ store: { dispatch } }) => {
    return dispatch(emojisAction());
  },
}],
(state) => ({ people: state.people, emojis: state.emojis }))
class About extends React.Component<IProps, any> {

  // private king = divIcon({
  //   html: '🤴',
  //   className: style.bigIcon,
  //   // iconSize: [40, 40],
  //   iconAnchor: [20, 30],
  // });

  // private queen = divIcon({
  //   html: '👸',
  //   className: style.bigIcon,
  //   // iconSize: [40, 40],
  //   iconAnchor: [20, 30],
  // });

  private createPersonMarkers(person, key) {
    const lastLocations = _.get(person, 'last_location.hits.hits', []);
    // let ageConstant = 1;
    // let oldestTs = lastLocations[0] && lastLocations[0].timestamp || 0;
    // const newestTs = moment().valueOf();

    console.log(lastLocations);

    // if (lastLocations.length >= 2) {
    // tslint:disable-next-line:max-line-length
    //   oldestTs = _.minBy(lastLocations, (l) => {console.log('lll', l); return l._source.timestamp; })._source.timestamp;
    //   console.log('oldestTS', oldestTs);
    //   // newestTs = _.maxBy(lastLocations, (l) => l._source.timestamp)._source.timestamp;
    //   ageConstant = newestTs - oldestTs;
    // }

    // return _.reverse(_.map(lastLocations, (location, i) => {
    //   const lastPosition = location._source.point;
    //   const position = [lastPosition.lat, lastPosition.lon];
    //   const firstEmoji = location._source.emoji && _.first(emojiTree(location._source.emoji), {type: 'emoji'});
    //   const icon = firstEmoji && firstEmoji.text || '';
    //   const message = location._source.message || '';
    //   const age = newestTs - location._source.timestamp;
    //   const opacity = age / ageConstant;
    //   console.log('DEBBUGGING');
    //   console.log('ts', location._source.timestamp);
    //   console.log('oldest', oldestTs);
    //   console.log('newest', newestTs);
    //   console.log('age', age);
    //   console.log('ageConstant', ageConstant);
    //   console.log('opacity', opacity);

    //   return this.createMarker(position, icon, message, opacity, key + '-' +  i);
    // }));

    const lastPosition = lastLocations[0]._source.point;
    const position = [lastPosition.lat, lastPosition.lon];
    const firstEmoji = lastLocations[0]._source.emoji &&
      _.first(emojiTree(lastLocations[0]._source.emoji), {type: 'emoji'});
    const icon = firstEmoji && firstEmoji.text || '🙂';
    // const message = lastLocations[0]._source.message || 'hi!';

    return this.createMarker(position, icon, lastLocations[0]._source.user, 1, key);
  }

  private createMarker(position, icon, message, opacity, key) {
    const markerIcon = divIcon({
      html: `<span style="opacity:${opacity}">${icon}</span>`,
      className: style.bigIcon,
      // iconSize: [40, 40],
      iconAnchor: [20, 30],
    });

    return (
      <Marker position={position} icon={markerIcon} key={key}>
        <Popup>
            <span>{message}</span>
        </Popup>
      </Marker>
    );
  }

  public render() {
    const { people, emojis } = this.props;

    console.log('EMOJIS', emojis);

    // const max = _.find(people.people, (v) => v.key.startsWith('max'));
    // const sharon = _.find(people.people, (v) => v.key.startsWith('sharon'));

    // const lastPosition = _.get(max, 'last_location.hits.hits[0]._source.point', { lat: 0, lon: 0 });
    // const lastPositionSharon = _.get(sharon, 'last_location.hits.hits[0]._source.point', { lat: 0, lon: 0 });
    // const position = [lastPosition.lat, lastPosition.lon];
    // const positionSharon = [lastPositionSharon.lat, lastPositionSharon.lon];

    const lat = 'last_location.hits.hits[0]._source.point.lat';
    const lon = 'last_location.hits.hits[0]._source.point.lon';

    const bounds = [
      [_.get(_.minBy(people.people, lat), lat), _.get(_.minBy(people.people, lon), lon)],
      [_.get(_.maxBy(people.people, lat), lat), _.get(_.maxBy(people.people, lon), lon)],
    ];

    return (
      <div className={style.About}>
        <h4>About</h4>
        {/* <People/> */}
        <Map bounds={bounds} className={style.blah}>
          <TileLayer
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
             attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
           />
           {_.flatten(_.map(people.people, (person, i) => this.createPersonMarkers(person, i)))}
        </Map>
      </div>
    );
  }
}

export { About }

// tslint:disable-next-line
// [ { "key": "maxwell.g.lang@gmail.com", "doc_count": 18, "last_location": { "hits": { "total": 18, "max_score": null, "hits": [ { "_index": "locations", "_type": "location", "_id": "AWFJh9s858UbSp3UoN8n", "_score": null, "_source": { "user": "maxwell.g.lang@gmail.com", "latitude": 37.33056973, "longitude": -122.0288791, "accuracy": 10, "point": { "lat": 37.33056973, "lon": -122.0288791 }, "timestamp": 1517357095694, "recorded": 1517357095701 }, "sort": [ 1517357095694 ] } ] } }, "latest_recorded": { "value": 1517357095694, "value_as_string": "2018-01-31T00:04:55.694Z" } }, { "key": "sharon.e.lee@gmail.com", "doc_count": 14, "last_location": { "hits": { "total": 14, "max_score": null, "hits": [ { "_index": "locations", "_type": "location", "_id": "AWFFb3ZX58UbSp3UoN8P", "_score": null, "_source": { "user": "sharon.e.lee@gmail.com", "latitude": 40.7483, "longitude": -73.9846, "accuracy": 20, "point": { "lat": 40.7483, "lon": -73.9846 }, "timestamp": 1517201988000, "recorded": 1517288388062 }, "sort": [ 1517201988000 ] } ] } }, "latest_recorded": { "value": 1517201988000, "value_as_string": "2018-01-29T04:59:48.000Z" } } ]
