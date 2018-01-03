const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretToken = require('../config').secretToken;
const validate = require('jsonschema').validate;

const router = express.Router();

/* GET a specific user by id */
router.get('/:user_id', async (req, res, next) => {
	const validReq = {
		type: 'object',
		maxProperties: 1,
		required: ['user_id'],
		properties: {
			user_id: { type: 'string' }
		}
	};
	if (!validate(req.params, validReq).valid) {
		res.sendStatus(400);
	} else {
		try {
			const rows = await User.getByID(req.params.user_id);
			res.json(rows);
		} catch (err) {
			next(err);
		}
	}
});

/* GET a specific user by username */
router.get('/username/:username', async (req, res, next) => {
	const validReq = {
		type: 'object',
		maxProperties: 1,
		required: ['username'],
		properties: {
			username: {	type: 'string' }
		}
	};
	if (!validate(req.params, validReq).valid) {
		res.sendStatus(400);
	} else {
		try {
			const rows = await User.getByUsername(req.params.username);
			res.json(rows);
		} catch (err) {
			next(err);
		}
	}
});

/* GET all user profile information about a user by username */
router.get('/profile/:username', async (req, res, next) => {
	const validReq = {
		type: 'object',
		maxProperties: 1,
		required: ['username'],
		properties: {
			username: {	type: 'string' }
		}
	};
	if (!validate(req.params, validReq).valid) {
		res.sendStatus(400);
	} else {
		try {
			const rows = await User.getUserProfile(req.params.username);
			res.json(rows);
		} catch (err) {
			next(err);
		}
	}
});

/* Create a new user */
router.post('/', async (req, res) => {
	const validReq = {
		type: 'object',
		maxProperties: 3,
		required: ['username', 'password', 'email'],
		properties: {
			username: { type: 'string' },
			password: { type: 'string' },
			email: { type: 'string' }
		}
	};
	try {
		if ((!validate(req.body, validReq))
			|| req.body.username.length > 15
			|| req.body.password.length < 6
			|| req.body.password.length > 50
			|| req.body.email.length < 3
			|| req.body.email.length > 254) {
			res.status(400).send({ error: 'Failed to create new user' });
		} else {
			const hash = bcrypt.hashSync(req.body.password, 10);
			const id = await new User(undefined, req.body.username, req.body.email, hash).insert();
			const user = await User.getByID(id);
			const token = jwt.sign(user, secretToken, { expiresIn: 86400 });
			res.json({ user: user, token: token	});
		}
	} catch (err) {
		res.status(400).send({ error: 'Failed to create new user' });
	}
});

module.exports = router;
