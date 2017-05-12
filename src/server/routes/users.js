const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authentication = require('../services/authenticator');

const router = express.Router();

/* GET all users */
router.get('/', async (req, res) => {
	try {
		const rows = await User.getAll();
		res.json(rows);
	} catch (err) {
		console.error(`Error while performing GET all users: ${err}`);
		res.status(400).send({ error: 'Failed to get all users' });
	}
});

/* GET a specific user by id */
router.get('/:user_id', async (req, res) => {
	try {
		const rows = await User.getByID(req.params.user_id);
		res.json(rows);
	} catch (err) {
		console.error(`Error while performing GET specific user by id: ${err}`);
		res.status(400).send({ error: 'Failed to get user' });
	}
});

/* GET a specific user by username */
router.get('/username/:username', async (req, res) => {
	try {
		const rows = await User.getByUsername(req.params.username);
		res.json(rows);
	} catch (err) {
		console.error(`Error while performing GET specific user by username: ${err}`);
		res.status(400).send({ error: 'Failed to get user' });
	}
});

/* Create a new user */
router.post('/', async (req, res) => {
	try {
		const hash = bcrypt.hashSync(req.body.password, 10);
		await new User(undefined, req.body.username, req.body.email, hash).insert();
		res.end();
	} catch (err) {
		console.error(`Error while performing POST create specific user: ${err}`);
		res.status(400).send({ error: 'Failed to create new user' });
	}
});

router.use(authentication);

/* Update player ratings */
router.post('/ratings', async (req, res) => {
	try {
		await User.updateRatings(req.body.id1, req.body.id2, req.body.id3, req.body.id4, req.body.winner, req.body.mode);
		res.end();
	} catch (err) {
		console.error(`Error while performing POST update player ratings: ${err}`);
		res.status(400).send({ error: 'Failed to update player ratings' });
	}
});

module.exports = router;
