import * as moment from 'moment';
const express = require('express');
const _ = require('lodash');
const router = express.Router();

const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'http://localhost:9200',
  log: 'trace',
});

// TODO: make more secure
router.use((__, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/* GET home page. */
router.get('/', (__, res) => {
  client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000,
  }, (error) => {
    if (error) {
      res.status(500);
      res.send('500 ERROR: Elasticsearch unreachable.');
    } else {
      res.sendStatus(200);
    }
  });
});

router.post('/:user/locations', (req, res) => {
  console.log('doing');
  const user = req.params.user;
  const locations = req.body;
  // locations = JSON.parse(locations);
  console.log('REQ BODY', req.body);

  // tslint:disable-next-line
  // locations = [{"location":{"mocked":false,"timestamp":1509403057000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.41199833333334}},"date":1509403117216},{"location":{"mocked":false,"timestamp":1509403128000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.41199833333334}},"date":1509403128431},{"location":{"mocked":false,"timestamp":1509403141000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.421998333333335}},"date":1509403141112},{"location":{"mocked":false,"timestamp":1509403196000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1509403196659},{"location":{"mocked":false,"timestamp":1509403196000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1509403288989},{"location":{"mocked":false,"timestamp":1510177626000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1510177626985},{"location":{"mocked":false,"timestamp":1510177643000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1510177669194},{"location":{"mocked":false,"timestamp":1510177643000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1510177737117},{"location":{"mocked":false,"timestamp":1510177643000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1510177745924}]

  const body = _(locations).reject({location: null}).map((v) => [
    { index:  { _index: (v.type === 'emoji' ? 'emojis' : 'locations'), _type: 'location'} },
    {
      user,
      emoji: v.emoji,
      message: v.message,
      latitude: v.location.coords.latitude,
      longitude: v.location.coords.longitude,
      accuracy: v.location.coords.accuracy,
      point: {
        lat: v.location.coords.latitude,
        lon: v.location.coords.longitude,
      },
      timestamp: Math.floor(v.location.timestamp), // get rid of ts decimal
      recorded: v.date,
    },
  ]).flatten().value();

  console.log('BULK REQ BODY', body);

  client.bulk({
    body,
    refresh: true, // TODO: remove for perf - figure out how to get this working
  }, (err) => {
    // TODO: also check the response status, can return no error but the request itself might have an error
    res.sendStatus(err ? 500 : 200);
  });

});

// DEFAULT BG LOCATION POST TEMPLATE
// postTemplate={
//   accuracy = "@accuracy";
//   altitude = "@altitude";
//   altitudeAccuracy = "@altitudeAccuracy";
//   bearing = "@bearing";
//   latitude = "@latitude";
//   locationProvider = "@locationProvider";
//   longitude = "@longitude";
//   provider = provider;
//   radius = "@radius";
//   speed = "@speed";
//   time = "@time";
// }

// TODO: add user, message, emoji

// TODO: CORRECTLY ADD SECURITY - USE AUTH TOKEN

// router.post('/:user/locations', (req, res) => {
//   console.log('doing');
//   const user = req.params.user;
//   const locations = req.body;
//   // locations = JSON.parse(locations);
//   console.log('REQ BODY', req.body);

  // tslint:disable-next-line
//   // locations = [{"location":{"mocked":false,"timestamp":1509403057000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.41199833333334}},"date":1509403117216},{"location":{"mocked":false,"timestamp":1509403128000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.41199833333334}},"date":1509403128431},{"location":{"mocked":false,"timestamp":1509403141000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.421998333333335}},"date":1509403141112},{"location":{"mocked":false,"timestamp":1509403196000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1509403196659},{"location":{"mocked":false,"timestamp":1509403196000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1509403288989},{"location":{"mocked":false,"timestamp":1510177626000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1510177626985},{"location":{"mocked":false,"timestamp":1510177643000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1510177669194},{"location":{"mocked":false,"timestamp":1510177643000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1510177737117},{"location":{"mocked":false,"timestamp":1510177643000,"coords":{"speed":0,"heading":0,"accuracy":20,"longitude":-122.08400000000002,"altitude":0,"latitude":37.43299833333333}},"date":1510177745924}]

//   const missingUser = _.find(locations, (l) => !l);
//   if (missingUser) {
//     res.status(500);
//     return res.send('Found location missing user', missingUser);
//   }

//   const body = _(locations).reject({location: null}).map((v) => [
//     { index:  { _index: 'locations', _type: 'location'} },
//     {
//       user,
//       emoji: v.emoji,
//       message: v.message,
//       latitude: v.location.coords.latitude,
//       longitude: v.location.coords.longitude,
//       accuracy: v.location.coords.accuracy,
//       point: {
//         lat: v.location.coords.latitude,
//         lon: v.location.coords.longitude,
//       },
//       timestamp: Math.floor(v.location.timestamp), // get rid of ts decimal
//       recorded: v.date,
//     },
//   ]).flatten().value();

//   console.log('BULK REQ BODY', body);

//   client.bulk({
//     body,
//     refresh: true,
//   }, (err) => {
//     res.sendStatus(err ? 500 : 200);
//   });

// });

router.get('/:user/locations', (req, res) => {
  const user = req.params.user;

  const body = {
    query : {
      constant_score : {
        filter : {
          term : {
            'user.raw': user, // NOTE: make sure you set up es using the line from the readme
          },
        },
      },
    },
    sort: [{timestamp: {order: 'desc'}}, {recorded: {order: 'desc'}}],
  };

  client.search({
    index: 'locations',
    type: 'location',
    body,
  }).then((resp) => {
    const hits = resp.hits.hits;
    res.send(hits);
  }, (err) => {
    console.trace(err.message);
    res.sendStatus(err ? 500 : 200);
  });

});

router.get('/users', (__, res) => {
  const body = {
    size: 0,
    aggs: {
      group_by_user: {
        terms: {
          field: 'user.raw',
          order : { latest_recorded : 'desc' },
          size: 100, // TODO: check cardinality first? Filter by nearby users, etc
        },
        aggs: {
          latest_recorded: {
            max : {field: 'timestamp'},
          },
          last_location: {
            top_hits: {
              sort: [{timestamp: {order: 'desc'}}, {recorded: {order: 'desc'}}],
              size: 10,
            },
          },
        },
      },
    },
  };

  client.search({
    index: 'locations',
    type: 'location',
    body,
  }).then((resp) => {
    console.log('RESP', resp);
    const buckets = _.get(resp, 'aggregations.group_by_user.buckets');
    console.log('buckets', buckets);
    res.send(buckets);
  }, (err) => {
    console.trace(err.message);
    res.sendStatus(err ? 500 : 200);
  });

});

router.get('/emojis', (__, res) => {
  const body = {
    size: 0,
    filter: {
      range: { timestamp: { gte: moment().subtract(1, 'hour').toISOString() } },
    },
    sort: [{timestamp: {order: 'desc'}}, {recorded: {order: 'desc'}}],
  };

  client.search({
    index: 'emojis',
    type: 'location',
    body,
  }).then((resp) => {
    const hits = resp.hits.hits;
    res.send(hits);
  }, (err) => {
    console.trace(err.message);
    res.sendStatus(err ? 500 : 200);
  });

});

// TODO factor into second file

///// GOOGLE MAPS

const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_API_KEY,
});

// /places?lat={latitude}&lon={longitude}
router.get('/places', (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;
  const radius = req.query.r && _.string(req.query.r); // precision in meters
  const query = req.query.q;

  if (query) {
    googleMapsClient.places({
      location: [lat, lon],
      radius: radius || 50,
      query,
      type: 'point_of_interest',
    }, (err, response) => {
      if (!err) {
        res.send(response);
      } else {
        res.status(500);
        res.send(err);
      }
    });
  } else {
    googleMapsClient.placesNearby({
      location: [lat, lon],
      radius: radius || 50,
      type: 'point_of_interest',
    }, (err, response) => {
      if (!err) {
        res.send(response);
      } else {
        res.status(500);
        res.send(err);
      }
    });
  }
});

const types = [
'accounting',
'airport',
'amusement_park',
'aquarium',
'art_gallery',
'atm',
'bakery',
'bank',
'bar',
'beauty_salon',
'bicycle_store',
'book_store',
'bowling_alley',
'bus_station',
'cafe',
'campground',
'car_dealer',
'car_rental',
'car_repair',
'car_wash',
'casino',
'cemetery',
'church',
'city_hall',
'clothing_store',
'convenience_store',
'courthouse',
'dentist',
'department_store',
'doctor',
'electrician',
'electronics_store',
'embassy',
'fire_station',
'florist',
'funeral_home',
'furniture_store',
'gas_station',
'gym',
'hair_care',
'hardware_store',
'hindu_temple',
'home_goods_store',
'hospital',
'insurance_agency',
'jewelry_store',
'laundry',
'lawyer',
'library',
'liquor_store',
'local_government_office',
'locksmith',
'lodging',
'meal_delivery',
'meal_takeaway',
'mosque',
'movie_rental',
'movie_theater',
'moving_company',
'museum',
'night_club',
'painter',
'park',
'parking',
'pet_store',
'pharmacy',
'physiotherapist',
'plumber',
'police',
'post_office',
'real_estate_agency',
'restaurant',
'roofing_contractor',
'rv_park',
'school',
'shoe_store',
'shopping_mall',
'spa',
'stadium',
'storage',
'store',
'subway_station',
'supermarket',
'synagogue',
'taxi_stand',
'train_station',
'transit_station',
'travel_agency',
'veterinary_care',
'zoo',
];

// TODO: handle multiple types

// https://developers.google.com/places/web-service/supported_types
// /places?lat={latitude}&lon={longitude}
router.get('/closest', (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;
  const type = req.query.type || 'point_of_interest';

  googleMapsClient.placesNearby({
    location: [lat, lon],
    rankby: 'distance',
    type,
  }, (err, response) => {
    if (!err) {
      res.send(response);
    } else {
      res.status(500);
      res.send(err);
    }
  });

});

router.get('/types', (__, res) => {
  res.send(types);
});

router.get('/details', (req, res) => {
  const placeid = req.query.id;

  googleMapsClient.place({
    placeid,
  }, (err, response) => {
    if (!err) {
      res.send(response);
    } else {
      res.status(500);
      res.send(err);
    }
  });

});

module.exports = router;
