var mysql = require('mysql');

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'jzdMySQL88',
    database : 'bughouse_db'
});

exports.pool = pool;