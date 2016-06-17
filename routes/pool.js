var mysql = require('mysql');
var config = require('../config');

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : config.database_password,
    database : 'bughouse_db'
});

exports.pool = pool;