const express = require('express');
const User = require('../models/User');

const router = express.Router();

/* GET leaderboard */
router.get('/', async (req, res, next) => {
	try {
		const rows = await User.getLeaderboard();
		res.json(rows);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
