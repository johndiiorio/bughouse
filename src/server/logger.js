const fs = require('fs');
const logFile = require('./config').logFile;

function logMessage(message, level, logToFile) {
	const messageToLog = `[${level}@${new Date(Date.now()).toISOString()}] ${message}\n`;
	if (level === 'error') {
		console.error(messageToLog); // eslint-disable-line no-console
	} else {
		console.log(messageToLog); // eslint-disable-line no-console
	}
	if (logToFile) {
		fs.appendFile(logFile, messageToLog, err => {
			if (err) {
				console.error(`Failed to write to log file: ${err}`); // eslint-disable-line no-console
			}
		});
	}
}

module.exports = {
	log: (message, logToFile = true) => {
		logMessage(message, 'standard', logToFile);
	},
	error: (message, logToFile = true) => {
		logMessage(message, 'error', logToFile);
	}
};
