var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'jzdMySQL88',
    database: 'bughouse_db'
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    var conn = connection.connect();
    connection.query('SELECT * from users', function (err, rows, fields) {
        if (!err) {
            res.send(rows);
        }
        else {
            console.log('Error while performing Query.');
        }
    });
    connection.end();
});

module.exports = router;
