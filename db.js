var postgressPass = require('./config');

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:' + postgressPass + '@localhost:5432/starwars')


module.exports = db;