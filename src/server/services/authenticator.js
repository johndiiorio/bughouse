const express = require('express');
const config = require('../../config');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const token = req.headers['x-access-token'] || req.body.token || req.query.token;
	if (token) {
		jwt.verify(token, config.token_secret, (err, decoded) => {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			}
			req.decoded = decoded;
			next();
		});
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
};
