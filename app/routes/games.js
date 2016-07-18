var express = require('express');
var pool = require('../../models/pool.js').pool;
var authentication = require('../controllers/authenticator');
var Bug = require('../controllers/bug');
var router = express.Router();

/* Get all games */
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

/* GET all open games */
router.get('/open', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("SELECT * FROM games WHERE status = 'open' ORDER by timestamp ASC", function (err, rows) {
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
/* Get a single game */
router.get('/:game_id', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("SELECT * FROM games WHERE game_id = ?", req.params.game_id, function (err, rows) {
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
/* Update players for an open game */
router.put('/open/:game_id', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        var statement = "UPDATE Games SET fk_player1_id = (SELECT user_id FROM USERS WHERE user_id = ?), fk_player2_id = (SELECT user_id FROM USERS WHERE user_id = ?), fk_player3_id = (SELECT user_id FROM USERS WHERE user_id = ?), fk_player4_id = (SELECT user_id FROM USERS WHERE user_id = ?) WHERE game_id = ?";
        connection.query(statement, [req.body.player1, req.body.player2, req.body.player3, req.body.player4 ,req.params.game_id], function (err, rows) {
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
/* Start a game */
router.put('/start/:game_id', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("UPDATE Games SET status = 'playing' WHERE game_id = ?", req.params.game_id, function (err, rows) {
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
/* Create a new game */
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
        var game_id = (Math.random() +1).toString(36).substr(2, 12);

        var statement = "INSERT INTO GAMES (game_id, minutes, increment, rating_range, mode, status, timestamp, join_random, fk_player1_id, fk_player2_id, fk_player3_id, fk_player4_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, (SELECT user_id FROM USERS WHERE user_id = ?), (SELECT user_id FROM USERS WHERE user_id=?), (SELECT user_id FROM USERS WHERE user_id=?), (SELECT user_id FROM USERS WHERE user_id=?))";
        connection.query(statement, [game_id, req.body.minutes, req.body.increment, req.body.rating_range, req.body.mode, req.body.status, currentTime, req.body.join_random, req.body.player1, req.body.player2, req.body.player3, req.body.player4], function (err) {
            connection.release();
            if (!err) {
                res.json(game_id);
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

//router.use(authentication);

/* Check if pawn promotion is possible */
router.put('/validate/pawnpromotion/:game_id', function (req, res) {
    if (req.body.source == "spare" || req.body.piece.charAt(1).toLowerCase() != 'p' || (req.body.target.charAt(1) != 1 && req.body.target.charAt(1) != 8)) { // Not a valid promotion
        res.json({valid: false});
        return;
    }
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("SELECT * From Games WHERE game_id = ?", [req.params.game_id], function (err, rows) {
            connection.release();
            if (!err) {
                var game;
                if (req.body.fkNum == 1 || req.body.fkNum == 2) {
                    game = new Bug(rows[0].left_fen);
                } else {
                    game = new Bug(rows[0].right_fen);
                }
                var move = game.move({
                    from: req.body.source,
                    to: req.body.target,
                    promotion: 'q' // doesn't matter the promotion, user will decide later
                });
                if (move) {
                    res.json({valid: true});
                } else {
                    res.json({valid: false, fen: game.fen()});
                }
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

/* Update a game's moves */
router.put('/update/moves/:game_id', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("UPDATE Games SET moves = ? WHERE game_id = ?", [req.body.moves, req.params.game_id], function (err, rows) {
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
/* Update a game's reserve */
router.put('/update/reserve/:game_id', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("UPDATE Games SET ?? = ? WHERE game_id = ?", [req.body.reserve, req.body.pieces, req.params.game_id], function (err, rows) {
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

module.exports = router;
