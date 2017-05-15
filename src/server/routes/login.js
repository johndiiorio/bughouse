const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const secretToken = require('../config').secretToken;

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const user = await User.validatePassword(req.body.username, req.body.password);
		if (user) {
			const token = jwt.sign(user, secretToken, { expiresIn: 86400 });
			res.json({ user: user, token: token });
		} else {
			res.status(401).send({ error: 'Failed to login' });
		}
	} catch (err) {
		console.error(`Error while performing POST login: ${err}`);
		res.status(500).send({ error: 'Failed to login' });
	}
});

router.post('/token', async (req, res) => {
	const token = req.headers.token || req.body.token || req.query.token;
	if (token) {
		jwt.verify(token, secretToken, (err, decoded) => {
			if (err) {
				res.status(401).json({ success: false, error: 'Failed to authenticate token.' });
			} else {
				delete decoded.iat;
				delete decoded.exp;
				res.json(decoded);
			}
		});
	} else {
		res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

module.exports = router;
