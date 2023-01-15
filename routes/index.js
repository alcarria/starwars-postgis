var express = require('express');
var router = express.Router();
var o2x = require('object-to-xml');

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:postgres@localhost:5432/starwars')



/* GET home page. */
router.get('/', function (req, res, next) {
  db.any('SELECT * FROM personajes ORDER BY id ASC')
    .then((personajes) => {
      console.log('DATA:', personajes);
      res.render('index', { title: 'Starwars page', personajes });
    })
    .catch((error) => {
      console.log('ERROR:', error);
      next(error);
    })
});

router.post('/', function (req, res, next) {
  db.none('INSERT INTO personajes(nombre, fuerza, faccion) VALUES($1, $2, $3)', [req.body.nombre, req.body.fuerza, req.body.faccion])
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


module.exports = router;
