const secretToken = require('../config').secretToken;
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const token = req.headers.token || req.body.token || req.query.token;
	if (token) {
		jwt.verify(token, secretToken, (err, decoded) => {
			if (err) {
				res.status(401).json({ success: false, error: 'Failed to authenticate token.' });
			}
			req.decoded = decoded;
			next();
		});
	} else {
		res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
};
