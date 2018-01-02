const express = require('express');
const User = require('../models/User');
const RateLimit = require('express-rate-limit');

const router = express.Router();

const limiter = new RateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 15,
	delayMs: 0
});

router.use(limiter);

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
