const database = require('./database');

const db = database.db;
const sqlFile = database.sqlFile;

class Game {
	constructor(id, player1, player2, player3, player4, minutes, increment, ratingRange, mode, status, timestamp, joinRandom) {
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
		this.timestamp = timestamp;
		this.joinRandom = joinRandom;
	}

	static createTable() {
		return db.none(sqlFile('game/create_games_table.sql'));
	}

	static async getAll() {
		return await db.any(sqlFile('game/get_all_games.sql'));
	}

	static async getAllOpen() {
		return await db.any(sqlFile('game/get_all_open_games.sql'));
	}

	static async getByID(id) {
		return await db.one(sqlFile('user/get_game_by_id.sql'), { id: id });
	}

	static async updatePlayers(id, player1, player2, player3, player4) {
		return await db.none(sqlFile('game/update_players_open_game.sql'), { id, player1, player2, player3, player4 });
	}

	static async startGame(id) {
		return await db.none(sqlFile('game/start_game.sql'), { id });
	}

	static async createGame(player1, player2, player3, player4, minutes, increment, ratingRange, mode, status, joinRandom) {
		const numGamesStart = await db.one(sqlFile('game/create_game.sql'));
		let numGamesEnd = numGamesStart;
		let id;
		while (numGamesStart === numGamesEnd) {
			id = (Math.random() + 1).toString(36).substr(2, 12);
			await db.none(sqlFile('game/create_game.sql'), { id, player1, player2, player3, player4, minutes, increment, ratingRange, mode, status, joinRandom });
			numGamesEnd = await db.one(sqlFile('game/create_game.sql'));
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
