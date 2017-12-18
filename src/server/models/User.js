const database = require('./database');
const glicko = require('glicko2');
const bcrypt = require('bcryptjs');
const debug = require('debug')('bughouse');

const db = database.db;
const sqlFile = database.sqlFile;

class User {
	constructor(id, username, email, passwordHash, title, ratingBullet, rdBullet, ratingBlitz, rdBlitz, ratingClassical, rdClassical) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.passwordHash = passwordHash;
		this.title = title;
		this.ratingBullet = ratingBullet;
		this.rdBullet = rdBullet;
		this.ratingBlitz = ratingBlitz;
		this.rdBlitz = rdBlitz;
		this.ratingClassical = ratingClassical;
		this.rdClassical = rdClassical;
	}

	static createTable() {
		return db.none(sqlFile('user/create_users_table.sql'));
	}

	static mapRow(row) {
		return new User(row.id, row.username, row.email, undefined, row.title, row.rating_bullet, row.rd_bullet, row.rating_blitz, row.rd_blitz, row.rating_classical, row.rd_classical);
	}

	static async getAll() {
		const rows = await db.any(sqlFile('user/get_all_users.sql'));
		return rows.map(User.mapRow);
	}

	static async getByID(id) {
		const row = await db.one(sqlFile('user/get_user_by_id.sql'), { id: id });
		return User.mapRow(row);
	}

	static async getByUsername(username) {
		const row = await db.one(sqlFile('user/get_user_by_username.sql'), { username: username });
		return User.mapRow(row);
	}

	static async validatePassword(username, password) {
		try {
			const row = await db.oneOrNone(sqlFile('user/get_password_by_username.sql'), { username });
			if (row) {
				const isValid = await bcrypt.compare(password, row.password_hash);
				if (isValid) {
					return await User.getByUsername(username);
				}
			}
			const err = new Error();
			err.status = 401;
			throw err;
		} catch (err) {
			err.status = 401;
			throw err;
		}
	}

	static async getByEmail(email) {
		const row = await db.one(sqlFile('user/get_user_by_email.sql'), { email: email });
		return User.mapRow(row);
	}

	async insert() {
		const user = this;
		if (user.id !== undefined) {
			throw new Error('Attempted to insert a user that already has an ID');
		}
		const row = await db.one(sqlFile('user/create_new_user.sql'), user);
		return row.id;
	}

	/**
	 * Returns a promise to update four players ratings (to be used at the end of a game)
	 * @param {Object} game
	 * @param {string} winner Either 'team1' (1 and 4 won), 'team2' (2 and 3 won), or 'draw'
	 * @returns {Promise.<>}
	 */
	static async updateRatings(game, winner) {
		try {
			const rows = await db.any(sqlFile('user/get_associated_users.sql'), { id1: game.player1, id2: game.player2, id3: game.player3, id4: game.player4 });
			const users = rows.map(User.mapRow);
			const settings = {
				tau: 0.5,
				rating: 1500,
				rd: 350,
				vol: 0.06
			};
			const ranking = new glicko.Glicko2(settings);
			let player1;
			let player2;
			let player3;
			let player4;
			let race;
			let updateRatingsMode;
			let updateRdMode;
			if (game.minutes < 3) {
				player1 = ranking.makePlayer(users[0].ratingBullet, users[0].rdBullet, 0.06);
				player2 = ranking.makePlayer(users[1].ratingBullet, users[1].rdBullet, 0.06);
				player3 = ranking.makePlayer(users[2].ratingBullet, users[2].rdBullet, 0.06);
				player4 = ranking.makePlayer(users[3].ratingBullet, users[3].rdBullet, 0.06);
				updateRatingsMode = 'rating_bullet';
				updateRdMode = 'rd_bullet';
			} else if (game.minutes >= 3 && game.minutes <= 8) {
				player1 = ranking.makePlayer(users[0].ratingBlitz, users[0].rdBlitz, 0.06);
				player2 = ranking.makePlayer(users[1].ratingBlitz, users[1].rdBlitz, 0.06);
				player3 = ranking.makePlayer(users[2].ratingBlitz, users[2].rdBlitz, 0.06);
				player4 = ranking.makePlayer(users[3].ratingBlitz, users[3].rdBlitz, 0.06);
				updateRatingsMode = 'rating_blitz';
				updateRdMode = 'rd_blitz';
			} else {
				player1 = ranking.makePlayer(users[0].ratingClassical, users[0].rdClassical, 0.06);
				player2 = ranking.makePlayer(users[1].ratingClassical, users[1].rdClassical, 0.06);
				player3 = ranking.makePlayer(users[2].ratingClassical, users[2].rdClassical, 0.06);
				player4 = ranking.makePlayer(users[3].ratingClassical, users[3].rdClassical, 0.06);
				updateRatingsMode = 'rating_classical';
				updateRdMode = 'rd_classical';
			}
			if (winner === 'team1') { // players 1 and 4 won
				race = ranking.makeRace([[player1, player4], [player2, player3]]);
			} else if (winner === 'team2') { // players 2 and 3 won
				race = ranking.makeRace([[player2, player3], [player1, player4]]);
			} else { // game drawn
				race = ranking.makeRace([[player1, player2, player3, player4]]);
			}
			ranking.updateRatings(race);
			const updateRatingsArgs = {
				updateRatingsMode,
				id1: game.player1,
				id2: game.player2,
				id3: game.player3,
				id4: game.player4,
				p1Value: player1.getRating(),
				p2Value: player2.getRating(),
				p3Value: player3.getRating(),
				p4Value: player4.getRating(),
			};
			const updateRdArgs = {
				updateRatingsMode: updateRdMode,
				id1: game.player1,
				id2: game.player2,
				id3: game.player3,
				id4: game.player4,
				p1Value: player1.getRd(),
				p2Value: player2.getRd(),
				p3Value: player3.getRd(),
				p4Value: player4.getRd(),
			};
			await db.none(sqlFile('user/update_ratings.sql'), updateRatingsArgs);
			await db.none(sqlFile('user/update_ratings.sql'), updateRdArgs);
		} catch (err) {
			debug(`Error while performing update user ratings: ${err}`);
		}
	}
}

module.exports = User;
