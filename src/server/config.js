const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '..', '..', '.env');
try {
	fs.accessSync(envPath);
	dotenv.config({ path: envPath });
} catch (err) {
	console.error("Couldn't load a .env file");
}


const config = {};

config.database = {
	user: process.env.BUGHOUSE_DB_USER,
	database: process.env.BUGHOUSE_DB_DATABASE,
	password: process.env.BUGHOUSE_DB_PASSWORD,
	host: process.env.BUGHOUSE_DB_HOST,
	port: process.env.BUGHOUSE_DB_PORT
};

config.secretToken = process.env.BUGHOUSE_TOKEN_SECRET;
config.serverPort = process.env.BUGHOUSE_SERVER_PORT;
config.logFile = process.env.BUGHOUSE_LOG_FILE || 'log.txt';
config.emailAddress = process.env.BUGHOUSE_EMAIL_ADDRESS;
config.emailPassword = process.env.BUGHOUSE_EMAIL_PASSWORD;
config.domainName = process.env.BUGHOUSE_DOMAIN_NAME;

module.exports = config;
