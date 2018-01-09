const bcrypt = require('bcryptjs');
const database = require('./database');
const Rating = require('./Rating');

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

	static async getByID(id) {
		try {
			const row = await db.oneOrNone(sqlFile('user/get_user_by_id.sql'), { id: id });
			if (row) {
				return User.mapRow(row);
			}
			const err = new Error();
			err.status = 401;
			throw err;
		} catch (err) {
			if (!err.status) {
				err.status = 500;
			}
			throw err;
		}
	}

	static async getByUsername(username) {
		try {
			const row = await db.oneOrNone(sqlFile('user/get_user_by_username.sql'), { username: username });
			if (row) {
				return User.mapRow(row);
			}
			const err = new Error();
			err.status = 401;
			throw err;
		} catch (err) {
			if (!err.status) {
				err.status = 500;
			}
			throw err;
		}
	}

	static async getUserProfile(username) {
		try {
			const user = await db.oneOrNone(sqlFile('user/get_user_without_ratings_by_username.sql'), { username: username });
			if (user) {
				user.gamesList = await User.getUserGames(user.id);
				user.bulletRd = user.rd_bullet;
				user.blitzRd = user.rd_blitz;
				user.classicalRd = user.rd_classical;
				delete user.rd_bullet;
				delete user.rd_blitz;
				delete user.rd_classical;

				const ratings = await Rating.getRatings(username);
				user.bulletRatings = [];
				user.blitzRatings = [];
				user.classicalRatings = [];
				for (const rating of ratings) {
					if (rating.ratingType === 'bullet') {
						user.bulletRatings.push([rating.ratingTimestamp, rating.rating]);
					} else if (rating.ratingType === 'blitz') {
						user.blitzRatings.push([rating.ratingTimestamp, rating.rating]);
					} else {
						user.classicalRatings.push([rating.ratingTimestamp, rating.rating]);
					}
				}
				return user;
			}
			const err = new Error();
			err.status = 401;
			throw err;
		} catch (err) {
			if (!err.status) {
				err.status = 500;
			}
			throw err;
		}
	}

	static async getUserGames(id) {
		try {
			const rows = await db.any(sqlFile('game/get_user_games.sql'), { id: id });
			return rows.map(row => {
				for (let i = 1; i <= 4; i++) {
					row[`player${i}`] = {
						title: row[`player${i}Title`],
						username: row[`player${i}Username`],
						rating: row[`player${i}Rating`]
					};
					delete row[`player${i}Title`];
					delete row[`player${i}Username`];
					delete row[`player${i}Rating`];
				}
				row.leftFen = row.leftFens.split(',')[row.leftFens.split(',').length - 1];
				row.rightFen = row.rightFens.split(',')[row.rightFens.split(',').length - 1];
				delete row.leftFens;
				delete row.rightFens;
				return row;
			});
		} catch (err) {
			if (!err.status) {
				err.status = 500;
			}
			throw err;
		}
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
			if (!err.status) {
				err.status = 500;
			}
			throw err;
		}
	}

	static async getLeaderboard() {
		try {
			const rows = await db.tx(t => t.batch([
				t.any(sqlFile('leaderboard/get_bullet_leaderboard.sql')),
				t.any(sqlFile('leaderboard/get_blitz_leaderboard.sql')),
				t.any(sqlFile('leaderboard/get_classical_leaderboard.sql'))
			]));

			return {
				bullet: rows[0],
				blitz: rows[1],
				classical: rows[2],
			};
		} catch (err) {
			if (!err.status) {
				err.status = 500;
			}
			throw err;
		}
	}

	static async updateResetToken(id, resetToken) {
		await db.none(sqlFile('user/update_reset_token.sql'), { id, resetToken });
	}

	static async getUserResetTokenById(id) {
		try {
			const row = await db.one(sqlFile('user/get_user_reset_token_by_id.sql'), { id });
			return row.reset_token;
		} catch (err) {
			err.status = 400;
			throw err;
		}
	}

	static async updatePasswordAndClearResetToken(id, passwordHash) {
		await db.none(sqlFile('user/update_password_clear_rest_token.sql'), { id, passwordHash });
	}

	async insert() {
		const user = this;
		if (user.id !== undefined) {
			throw new Error('Attempted to insert a user that already has an ID');
		}
		const row = await db.one(sqlFile('user/create_new_user.sql'), user);
		await db.tx(t => t.batch([
			t.none(sqlFile('rating/insert_new_user_ratings.sql'), { id: row.id, ratingType: 'bullet' }),
			t.none(sqlFile('rating/insert_new_user_ratings.sql'), { id: row.id, ratingType: 'blitz' }),
			t.none(sqlFile('rating/insert_new_user_ratings.sql'), { id: row.id, ratingType: 'classical' })
		]));
		return row.id;
	}
}

module.exports = User;
