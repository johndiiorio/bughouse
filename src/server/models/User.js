const database = require('./database');
const glicko = require('glicko2');
const bcrypt = require('bcryptjs');

const db = database.db;
const sqlFile = database.sqlFile;

class User {
	constructor(id, username, email, passwordHash, title, ratingBullet, rdBullet, ratingBlitz, rdBlitz, ratingClassical, rdClassical) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.password_hash = passwordHash;
		this.title = title;
		this.rating_bullet = ratingBullet;
		this.rd_bullet = rdBullet;
		this.rating_blitz = ratingBlitz;
		this.rd_blitz = rdBlitz;
		this.rating_classical = ratingClassical;
		this.rd_classical = rdClassical;
	}

	static createTable() {
		return db.none(sqlFile('user/create_users_table.sql'));
	}

	static async getAll() {
		return await db.any(sqlFile('user/get_all_users.sql'));
	}

	static async getByID(id) {
		return await db.one(sqlFile('user/get_user_by_id.sql'), { id: id });
	}

	static async getByUsername(username) {
		return await db.one(sqlFile('user/get_user_by_username.sql'), { username: username });
	}

	static async validatePassword(username, password) {
		const user = await db.oneOrNone(sqlFile('user/get_password_by_username.sql'), { username, password });
		if (user) {
			const isValid = await bcrypt.compare(password, user.password_hash);
			if (isValid) {
				return await User.getByUsername(username);
			}
		}
		return null;
	}

	static async getByEmail(email) {
		return await db.one(sqlFile('user/get_user_by_email.sql'), { email: email });
	}

	async insert() {
		const user = this;
		if (user.id !== undefined) {
			throw new Error('Attempted to insert a user that already has an ID');
		}
		return await db.none(sqlFile('user/create_new_user.sql'), user);
	}

	/**
	 * Returns a promise to update four players ratings (to be used at the end of a game)
	 * @param {int} id1 Player 1's ID
	 * @param {int} id2 Player 2's ID
	 * @param {int} id3 Player 3's ID
	 * @param {int} id4 Player 4's ID
	 * @param {string} winner Either 'near' (1 and 4 won) or 'far' (2 and 3 won)
	 * @param {string} mode Either 'bullet', 'blitz', or 'classical'
	 * @returns {Promise.<>}
	 */
	static async updateRatings(id1, id2, id3, id4, winner, mode) {
		try {
			const users = await db.one(sqlFile('user/get_associated_users.sql'), { id1, id2, id3, id4 });
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
			if (mode === 'bullet') {
				player1 = ranking.makePlayer(users[0].ratingBullet, users[0].rdBullet, 0.06);
				player2 = ranking.makePlayer(users[1].ratingBullet, users[1].rdBullet, 0.06);
				player3 = ranking.makePlayer(users[2].ratingBullet, users[2].rdBullet, 0.06);
				player4 = ranking.makePlayer(users[3].ratingBullet, users[3].rdBullet, 0.06);
				updateRatingsMode = 'rating_bullet';
				updateRdMode = 'rd_bullet';
			} else if (mode === 'blitz') {
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
			if (winner === 'near') { // players 1 and 4 won
				race = ranking.makeRace([[player1, player4], [player2, player3]]);
			} else if (winner === 'far') { // players 2 and 3 won
				race = ranking.makeRace([[player2, player3], [player1, player4]]);
			} else { // game drawn
				race = ranking.makeRace([[player1, player2, player3, player4]]);
			}
			ranking.updateRatings(race);
			const updateRatingsArgs = {
				updateRatingsMode,
				id1,
				p1Value: player1.getRating(),
				p2Value: player2.getRating(),
				p3Value: player3.getRating(),
				p4Value: player4.getRating(),
			};
			const updateRdArgs = {
				updateRdMode,
				id1,
				p1Value: player1.getRd(),
				p2Value: player2.getRd(),
				p3Value: player3.getRd(),
				p4Value: player4.getRd(),
			};
			await db.none(sqlFile('user/update_ratings.sql'), updateRatingsArgs);
			await db.none(sqlFile('user/update_ratings.sql'), updateRdArgs);
		} catch (err) {
			console.log(`Error while performing update user ratings: ${err}`);
		}
	}
}

module.exports = User;
