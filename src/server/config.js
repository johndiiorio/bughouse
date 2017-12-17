const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const debug = require('debug')('bughouse');

const envPath = path.join(__dirname, '..', '..', '.env');
try {
	fs.accessSync(envPath);
	dotenv.config({ path: envPath });
} catch (err) {
	debug("Couldn't load a .env file");
}


const config = {};

config.database = {
	user: process.env.DB_USER,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT
};

config.secretToken = process.env.TOKEN_SECRET;
config.serverPort = process.env.SERVER_PORT;

module.exports = config;
