const express = require('express');

const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('./logger');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, '..', 'client', 'favicon.ico')));
app.use(express.static(path.join(__dirname, '..', 'client')));

const users = require('./routes/users');
const games = require('./routes/games');
const login = require('./routes/login');
const leaderboard = require('./routes/leaderboard');

app.use('/api/users', users);
app.use('/api/games', games);
app.use('/api/login', login);
app.use('/api/leaderboard', leaderboard);

app.get('\\/|about|user|leaderboard|register|reset|loading|game/*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
});

app.use((req, res) => {
	res.status(404).send('<h1>404 Not Found<h1/>');
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
	if (err.status === 401) {
		res.sendStatus(401);
	} else {
		logger.error(err);
		res.status(500).send('<h1>Internal Server Error<h1/>');
	}
});


module.exports = app;
