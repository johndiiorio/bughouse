var express = require('express');
var mysql = require('mysql');
var pool = require('./pool.js').pool;
var bcrypt = require('bcryptjs');

var router = express.Router();

router.post('/', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        console.log(req.body);
        connection.query("SELECT * FROM USERS WHERE username = ?", req.body.username, function (err, user) {
            connection.release();
            if (!err && user.length > 0) {
                if (bcrypt.compareSync(req.body.password, user[0].password_hash)) {
                    res.json(user);
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