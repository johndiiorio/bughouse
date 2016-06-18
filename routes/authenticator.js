var express = require('express');
var config = require('../config');
var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    var token = req.headers['x-access-token'] || req.body.token || req.query.token;
    if (token) {
        jwt.verify(token, config.token_secret, function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
};
