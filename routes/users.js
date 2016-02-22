var express = require('express');
var mysql = require('mysql');
var pool = require('./pool.js').pool;
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    pool.getConnection(function(err,connection){
        if (err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }
        connection.query("SELECT * FROM USERS", function(err, rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }
            else {
                console.log('Error while performing query');
            }
        });
        connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
        });
    });
});

module.exports = router;
