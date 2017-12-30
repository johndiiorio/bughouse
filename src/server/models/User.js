const database = require('./database');
const bcrypt = require('bcryptjs');

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
