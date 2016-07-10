var express = require('express');
var pool = require('./../../models/pool.js').pool;
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../../config');

var router = express.Router();

router.post('/', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query("SELECT * FROM USERS WHERE username = ?", req.body.username, function (err, user) {
            connection.release();
            if (!err && user.length > 0) {
                if (bcrypt.compareSync(req.body.password, user[0].password_hash)) {
                    var token = jwt.sign(user[0], config.token_secret, {
                        expiresIn: 86400 // expires in one day
                    });
                    delete user[0].password_hash;
                    res.json({
                        user: user[0],
                        token: token
                    });
                } else {
                    res.status(500).send({ error: "error" });
                }
            }
            else {
                res.status(500).send({ error: "error" });
            }
        });
    });
});

module.exports = router;