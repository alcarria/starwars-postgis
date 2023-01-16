var express = require('express');
var router = express.Router();
var o2x = require('object-to-xml');

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:postgres@localhost:5432/starwars')



/* GET home page. */
router.get('/', function (req, res, next) {
  db.any('SELECT id, nombre, fuerza, faccion FROM personajes ORDER BY id ASC')
    .then((personajes) => {
      console.log('DATA:', personajes);      
      res.render('index', { title: 'Starwars page', personajes});
    })
    .catch((error) => {
      console.log('ERROR:', error);
      next(error);
    })
});

router.post('/', function (req, res, next) { 
  //ST_SetSRID(ST_MakeLine(ARRAY[ST_Point(-3.7211 40.4464),ST_Point(-3.7092 40.44020)]), 4326)
  var spatialQuery = "ST_SetSRID(ST_MakeLine(ARRAY[";
  for (punto of JSON.parse(req.body.ruta)) {
    spatialQuery = spatialQuery + "ST_Point("+punto.lng+","+punto.lat+"),";
  }
  spatialQuery = spatialQuery.slice(0, -1) + "]), 4326)";
  console.log(spatialQuery);

  db.none('INSERT INTO personajes(nombre, fuerza, faccion, geom) VALUES($1, $2, $3, $4# )', [req.body.nombre, req.body.fuerza, req.body.faccion, spatialQuery])
    .then(() => {
      // success;      
      res.redirect('/');
    })
    .catch(error => {
      console.log('ERROR:', error);
      next(error);
    });
});

router.get('/character/:ID', function (req, res, next) {
  var characterID = req.params.ID;
  db.one('SELECT * FROM personajes WHERE id = $1', [characterID])
    .then((personaje) => {
      console.log('DATA:', personaje);
      res.render('personaje', { title: 'Character page', personaje });
    })
    .catch((error) => {
      console.log('ERROR:', error);
      next(error);
    })
});

router.post('/character/:ID', function (req, res, next) {
  var characterID = req.params.ID;
  db.result('DELETE FROM personajes WHERE id = $1', [characterID])
    .then((result) => {
      console.log(result.rowCount); // print how many records were deleted; 
      res.redirect('/');
    })
    .catch((error) => {
      console.log('ERROR:', error);
      next(error);
    })
});

router.get('/xml', function (req, res, next) {
  db.any('SELECT * FROM personajes ORDER BY id ASC')
    .then((personajes) => {
      console.log('DATA:', personajes)
      res.set('Content-Type', 'text/xml');
      res.send(o2x({
        '?xml version="1.0" encoding="utf-8"?': null, personajes: { "personaje": personajes }
      }));
    })
    .catch((error) => {
      console.log('ERROR:', error)
      next(error);
    })
});

router.get('/json', function (req, res, next) {
  db.any('SELECT * FROM personajes ORDER BY id ASC')
    .then((personajes) => {
      console.log('DATA:', personajes);
      res.json(personajes);
    })
    .catch((error) => {
      console.log('ERROR:', error);
      next(error);
    })
});

/* GET home page. */
router.get('/geojson', function (req, res, next) {

  db.any("SELECT jsonb_build_object('type','FeatureCollection','features', jsonb_agg(feature)) FROM (  SELECT jsonb_build_object( 'type', 'Feature','id', id,'geometry', ST_AsGeoJSON(geom)::jsonb,'properties', to_jsonb(row) - 'gid' - 'geom') AS feature FROM (SELECT * FROM personajes) row) features;")
    .then((personajes) => {
      console.log('DATA:', personajes);
      res.json(personajes[0].jsonb_build_object);
    })
    .catch((error) => {
      console.log('ERROR:', error);
      next(error);
    })
});


module.exports = router;
