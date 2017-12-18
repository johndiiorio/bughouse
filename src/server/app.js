const express = require('express');

const app = express();
const debug = require('debug')('bughouse');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const games = require('./routes/games');
const login = require('./routes/login');

app.use(favicon(path.join(__dirname, '..', 'client', 'favicon.ico')));
if (process.env.NODE_ENV !== 'production') {
	app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.use('/api/users', users);
app.use('/api/games', games);
app.use('/api/login', login);

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
});

app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	if (!err.status) err.status = 500;
	res.status(err.status);
	debug(err);
	if (err.status === 404) res.send(`<h1>${err.status} Not found</h1>`);
	else res.send(`<h1>${err.status} Server Error</h1>`);
});

module.exports = app;
