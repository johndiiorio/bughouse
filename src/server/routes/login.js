const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validate = require('jsonschema').validate;
const RateLimit = require('express-rate-limit');
const User = require('../models/User');
const util = require('../util');
const secretToken = require('../config').secretToken;
const domainName = require('../config').domainName;

const router = express.Router();

const limiter = new RateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
	delayMs: 0
});

router.use(limiter);

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

router.post('/forgot', async (req, res, next) => {
	const validReq = {
		type: 'object',
		maxProperties: 1,
		required: ['username'],
		properties: {
			username: { type: 'string' }
		}
	};
	if (!validate(req.body, validReq)) {
		res.sendStatus(400);
	} else {
		try {
			const user = await User.getByUsername(req.body.username);
			if (user) {
				const resetToken = await util.random(20);
				const payload = {
					resetToken,
					id: user.id
				};
				const tokenJWT = jwt.sign(payload, secretToken, { expiresIn: '1 hour' });
				await User.updateResetToken(user.id, resetToken);
				util.sendEmail(
					user.email,
					`Reset your ${domainName} password`,
					`Your password reset link is: https://${domainName}/reset/${tokenJWT}`
				);
				res.sendStatus(200);
			} else {
				res.sendStatus(401);
			}
		} catch (err) {
			next(err);
		}
	}
});

router.post('/reset', async (req, res, next) => {
	const validReq = {
		type: 'object',
		maxProperties: 2,
		required: ['resetToken', 'password'],
		properties: {
			resetToken: { type: 'string' },
			password: { type: 'string' }
		}
	};
	if (!validate(req.body, validReq)
		|| req.body.password.length < 6
		|| req.body.password.length > 50) {
		res.sendStatus(400);
	} else {
		try {
			jwt.verify(req.body.resetToken, secretToken, async (err, decoded) => {
				if (err) {
					res.sendStatus(401);
				} else {
					const userID = decoded.id;
					const resetTokenFromDB = await User.getUserResetTokenById(userID);
					if (decoded.resetToken === resetTokenFromDB) {
						const passwordHash = bcrypt.hashSync(req.body.password, 10);
						await User.updatePasswordAndClearResetToken(userID, passwordHash);
						res.sendStatus(200);
					} else {
						res.sendStatus(401);
					}
				}
			});
		} catch (err) {
			next(err);
		}
	}
});

module.exports = router;
