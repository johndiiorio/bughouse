const _ = require('lodash');
const database = require('./database');
const User = require('./User');

const db = database.db;
const sqlFile = database.sqlFile;

class Game {
	constructor(id, player1, player2, player3, player4, minutes, increment, ratingRange,
				mode, status, termination, joinRandom, timestamp, clocks, moves, leftLastTime, rightLastTime,
				leftFen, rightFen, leftReserveWhite, leftReserveBlack, rightReserveWhite, rightReserveBlack,
				leftLastMove, rightLastMove, leftColorToPlay, rightColorToPlay, resignState, drawState) {
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
		this.termination = termination;
		this.joinRandom = joinRandom;
		this.timestamp = timestamp;
		this.clocks = clocks;
		this.moves = moves;
		this.left_last_time = leftLastTime;
		this.right_last_time = rightLastTime;
		this.left_fen = leftFen;
		this.right_fen = rightFen;
		this.left_reserve_white = leftReserveWhite;
		this.left_reserve_black = leftReserveBlack;
		this.right_reserve_white = rightReserveWhite;
		this.right_reserve_black = rightReserveBlack;
		this.left_last_move = leftLastMove;
		this.right_last_move = rightLastMove;
		this.left_color_to_play = leftColorToPlay;
		this.right_color_to_play = rightColorToPlay;
		this.resign_state = resignState;
		this.draw_state = drawState;
	}

	static createTable() {
		return db.none(sqlFile('game/create_games_table.sql'));
	}

	static mapRow(row) {
		return new Game(
			row.id, row.player1, row.player2, row.player3, row.player4,
			row.minutes, row.increment, row.rating_range, row.mode, row.status, row.termination, row.join_random,
			row.timestamp, row.clocks, row.moves, row.left_last_time, row.right_last_time, row.left_fen, row.right_fen,
			row.left_reserve_white, row.left_reserve_black,	row.right_reserve_white, row.right_reserve_black,
			row.left_last_move, row.right_last_move, row.left_color_to_play, row.right_color_to_play,
			row.resign_state, row.draw_state
		);
	}

	static mapRowGameWithUsers(row) {
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
	}

	static async getAll() {
		const rows = await db.any(sqlFile('game/get_all_games.sql'));
		return rows.map(Game.mapRow);
	}

	static async getAllOpen() {
		const rows = await db.any(sqlFile('game/get_all_open_games.sql'));
		return rows.map(Game.mapRowGameWithUsers);
	}

	static async getByID(id) {
		const row = await db.oneOrNone(sqlFile('game/get_game_by_id.sql'), { id: id });
		return Game.mapRow(row);
	}

	static async getGameWithUsersByID(id) {
		const row = await db.oneOrNone(sqlFile('game/get_game_with_users_by_id.sql'), { id: id });
		return Game.mapRowGameWithUsers(row);
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
					return true;
				}
			}
		} catch (err) {
			return false;
		}
		return false;
	}

	static async tryToStartGame(id) {
		const game = await Game.getByID(id);
		if (game.player1 !== null && game.player2 !== null && game.player3 !== null && game.player4 !== null) {
			await db.none(sqlFile('game/start_game.sql'), { id });
			return true;
		}
		return false;
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
}

module.exports = Game;
