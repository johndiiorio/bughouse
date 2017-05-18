const _ = require('lodash');
const database = require('./database');
const User = require('./User');

const db = database.db;
const sqlFile = database.sqlFile;

class Game {
	constructor(id, player1, player2, player3, player4, minutes, increment, ratingRange, mode, status, joinRandom) {
		this.id = id;
		this.player1 = player1;
		this.player2 = player2;
		this.player3 = player3;
		this.player4 = player4;
		this.minutes = minutes;
		this.increment = increment;
		this.ratingRange = ratingRange;
		this.mode = mode;
		this.status = status;
		this.joinRandom = joinRandom;
	}

	static createTable() {
		return db.none(sqlFile('game/create_games_table.sql'));
	}

	static mapRow(row) {
		return new Game(row.id, row.player1, row.player2, row.player3, row.player4, row.minutes, row.increment, row.rating_range, row.mode, row.status, row.join_random);
	}

	static async getAll() {
		const rows = await db.any(sqlFile('game/get_all_games.sql'));
		return rows.map(Game.mapRow);
	}

	static async getAllOpen() {
		const rows = await db.any(sqlFile('game/get_all_open_games.sql'));
		return rows.map(row => {
			const mappedObj = {
				player1: {},
				player2: {},
				player3: {},
				player4: {},
			};
			_.forOwn(row, (value, key) => {
				if (key.substring(0, 6) === 'player') {
					if (key[6] === '1') {
						mappedObj.player1[key.substring(7)] = value;
					} else if (key[6] === '2') {
						mappedObj.player2[key.substring(7)] = value;
					} else if (key[6] === '3') {
						mappedObj.player3[key.substring(7)] = value;
					} else {
						mappedObj.player4[key.substring(7)] = value;
					}
				} else {
					mappedObj[key] = value;
				}
			});
			return mappedObj;
		});
	}

	static async getByID(id) {
		const row = await db.one(sqlFile('game/get_game_by_id.sql'), { id: id });
		return Game.mapRow(row);
	}

	static async updatePlayer(id, playerPosition, player) {
		try {
			const user = await User.getByID(player);
			const game = await Game.getByID(id);
			let userRating;
			const gameRatingRange = game.ratingRange.split(' - ');
			if (game.minutes < 3) {
				userRating = user.ratingBullet;
			} else if (game.minutes >= 3 && game.minutes <= 8) {
				userRating = user.ratingBlitz;
			} else {
				userRating = user.ratingClassical;
			}
			const playerNum = parseInt(player);
			// Check if player is not already in the game
			if (playerNum !== game.player1 && playerNum !== game.player2 && playerNum !== game.player3 && playerNum !== game.player4) {
				// Check if player's rating is within game rating range and not overriding other player
				if (userRating >= gameRatingRange[0] && userRating <= gameRatingRange[1] && game[playerPosition] === null) {
					await db.none(sqlFile('game/update_player_open_game.sql'), { id, playerPosition, player });
					// Check if game is full, if so start game
					game[playerPosition] = player;
					if (game.player1 !== null && game.player2 !== null && game.player3 !== null && game.player4 !== null) {
						await db.none(sqlFile('game/start_game.sql'), { id });
						console.log('Started game');
						console.log(typeof io.in);
						io.in(id).emit('begin game');
					}
					return 0;
				}
			}
		} catch (err) {
			return 1;
		}
		return 1;
	}

	static async createGame(player1, player2, player3, player4, minutes, increment, ratingRange, mode, status, joinRandom) {
		const rowNumStart = await db.one(sqlFile('game/get_number_games.sql'));
		const numGamesStart = rowNumStart.count;
		let numGamesEnd = numGamesStart;
		let id;
		while (numGamesStart === numGamesEnd) {
			id = (Math.random() + 1).toString(36).substr(2, 12);
			await db.none(sqlFile('game/create_game.sql'), { id, player1, player2, player3, player4, minutes, increment, ratingRange, mode, status, joinRandom });
			const rowNumEnd = await db.one(sqlFile('game/get_number_games.sql'));
			numGamesEnd = rowNumEnd.count;
		}
		return id;
	}

	static async updateGameMoves(id, moves) {
		return await db.none(sqlFile('game/update_moves.sql'), { id, moves });
	}

	static async updateGameReserve(id, reserve, pieces) {
		return await db.none(sqlFile('game/update_one_column_single_game.sql'), { id, column: reserve, value: pieces });
	}
}

module.exports = Game;
