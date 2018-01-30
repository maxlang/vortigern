let express = require('express');
let _ = require('lodash');
let router = express.Router();

let elasticsearch = require('elasticsearch');
let client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

// TODO: make more secure
router.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/* GET home page. */
router.get('/', (_, res) => {
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

  const body = _(locations).map((v) => [
    { index:  { _index: 'locations', _type: 'location'} },
    {
      user,
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
    refresh: true,
  }, (err) => {
    res.sendStatus(err ? 500 : 200);
  });

});

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
    sort: { recorded: { order: 'desc' } },
  };

  client.search({
    index: 'locations',
      type: 'location',
        body}).then((resp) => {
      const hits = resp.hits.hits;
      res.send(hits);
    }, (err) => {
      console.trace(err.message);
    });

});

module.exports = router;
