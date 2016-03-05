var express = require('express');
var mysql = require('mysql');
var pool = require('./pool.js').pool;
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("SELECT * FROM games", function (err, rows) {
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
router.get('/open', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("SELECT * FROM games WHERE status = 'open'", function (err, rows) {
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
router.post('/', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        function twoDigits(d) {
            if (0 <= d && d < 10) return "0" + d.toString();
            if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
            return d.toString();
        }

        Date.prototype.toMysqlFormat = function () {
            return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
        };
        var currentTime = new Date().toMysqlFormat();
        console.log(currentTime);
        var statement = "INSERT INTO GAMES (minutes, increment, rating_range, mode, status, timestamp, join_random, fk_player1_id, fk_player2_id, fk_player3_id, fk_player4_id) VALUES (?, ?, ?, ?, ?, ?, ?, (SELECT user_id FROM USERS WHERE user_id = ?), (SELECT user_id FROM USERS WHERE user_id=?), (SELECT user_id FROM USERS WHERE user_id=?), (SELECT user_id FROM USERS WHERE user_id=?))";
        connection.query(statement, [req.body.minutes, req.body.increment, req.body.rating_range, req.body.mode, req.body.status, currentTime, req.body.join_random, req.body.player1, req.body.player2, req.body.player3, req.body.player4], function (err, game) {
            connection.release();
            if (!err) {
                res.json(game);
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
router.get('/:game_id', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("SELECT * FROM GAMES WHERE game_id = ?", req.params.game_id, function (err, game) {
            connection.release();
            if (!err) {
                res.json(game);
            }
            else {
                console.log('Error while performing query');
            }

        });
    });
});

module.exports = router;
