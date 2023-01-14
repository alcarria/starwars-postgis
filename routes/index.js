var express = require('express');
var router = express.Router();
var o2x = require('object-to-xml');

var personajes = [
  {
    Nombre: 'Darth vader',
    Fuerza: 100,
    Faccion: 'Imperio'
  }
  ];



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Starwars page', personajes });
});

router.post('/', function(req, res, next) {

  var nuevoPersonaje = { "Nombre": req.body.nombre, "Fuerza": req.body.fuerza, 
  "Faccion": req.body.faccion };
   
  personajes.push(nuevoPersonaje);

  res.redirect('/');
 });

 router.get('/character/:ID', function(req, res, next) {	
  var characterID = req.params.ID;
  if (characterID<=personajes.length && characterID>0){
    res.render('personaje', { title: 'Character page', personaje: personajes[characterID-1] });
  }
  else {
    // render the error page
    var err = new Error('Character Not Found');
    err.status = 404;
    next(err);
  }
  });

  router.post('/character/:ID', function(req, res, next) {	
    var characterID = req.params.ID;
    if (characterID<=personajes.length && characterID>0){
      personajes.splice(characterID-1,1);
      res.redirect('/');		
    }
    else {
      // render the error page
      var err = new Error('Character Not Found');
      err.status = 404;
      next(err);
    }
    });

    router.get('/xml', function(req, res, next) {
      res.set('Content-Type', 'text/xml');
    res.send(o2x({
    '?xml version="1.0" encoding="utf-8"?' : null, personajes: {"personaje": personajes}}));
      
    });

    router.get('/json', function(req, res, next) {      
          res.json(personajes);
  });


module.exports = router;
