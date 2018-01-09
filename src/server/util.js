const crypto = require('crypto');
const nodemailer = require('nodemailer');
const logger = require('./logger');
const fromEmailAddress = require('./config').emailAddress;
const emailPassword = require('./config').emailPassword;

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: fromEmailAddress,
		pass: emailPassword
	}
});

function random(length = 12) {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(Math.ceil(length / 2), (err, buffer) => {
			if (err) {
				reject(err);
			} else {
				resolve(buffer.toString('hex'));
			}
		});
	});
}

function sendEmail(toEmailAddress, subject, text) {
	const options = {
		to: toEmailAddress,
		from: fromEmailAddress,
		subject,
		text
	};
	transporter.sendMail(options, err => {
		if (err) {
			logger.error(err);
		}
	});
}

module.exports = {
	random: random,
	sendEmail: sendEmail
};
