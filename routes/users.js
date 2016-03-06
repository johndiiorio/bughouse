var express = require('express');
var mysql = require('mysql');
var pool = require('./pool.js').pool;
var router = express.Router();

/* GET all users */
router.get('/', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("SELECT * FROM users", function (err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
            else {
                console.log('Error while performing query');
            }
        });
        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});
        });
    });
});
/* GET a specific users */
router.get('/:user_id', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("SELECT * FROM USERS WHERE user_id = ?", req.params.user_id, function (err, user) {
            connection.release();
            if (!err) {
                res.json(user);
            }
            else {
                console.log('Error while performing query');
            }

        });
    });
});

module.exports = router;
