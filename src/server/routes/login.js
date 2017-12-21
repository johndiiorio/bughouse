const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const secretToken = require('../config').secretToken;
const validate = require('jsonschema').validate;

const router = express.Router();

router.post('/', async (req, res, next) => {
	const validReq = {
		type: 'object',
		maxProperties: 3,
		required: ['username', 'password'],
		properties: {
			username: { type: 'string' },
			password: { type: 'string' },
			email: { type: 'string' }
		}
	};
	if (!validate(req.body, validReq)) {
		res.sendStatus(400);
	} else {
		try {
			const user = await User.validatePassword(req.body.username, req.body.password);
			if (user) {
				const token = jwt.sign(user, secretToken, { expiresIn: '7 days' });
				res.json({ user, token });
			} else {
				res.sendStatus(401);
			}
		} catch (err) {
			next(err);
		}
	}
});

router.post('/token', async (req, res) => {
	const token = req.headers.token || req.body.token || req.query.token;
	if (token) {
		jwt.verify(token, secretToken, async (err, decoded) => {
			if (err) {
				res.status(401).json({ success: false, error: 'Failed to authenticate token.' });
			} else {
				const user = await User.getByID(decoded.id);
				res.json(user);
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
