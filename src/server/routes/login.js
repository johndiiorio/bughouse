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
			res.json({
				user: user,
				token: token
			});
		} else {
			res.status(500).send({ error: 'Failed to login' });
		}
	} catch (err) {
		console.error(`Error while performing POST login: ${err}`);
		res.status(500).send({ error: 'Failed to login' });
	}
});

module.exports = router;
