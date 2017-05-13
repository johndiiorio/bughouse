const database = require('./database');

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
		return rows.map(Game.mapRow);
	}

	static async getByID(id) {
		const row = await db.one(sqlFile('user/get_game_by_id.sql'), { id: id });
		return Game.mapRow(row);
	}

	static async updatePlayers(id, player1, player2, player3, player4) {
		return await db.none(sqlFile('game/update_players_open_game.sql'), { id, player1, player2, player3, player4 });
	}

	static async startGame(id) {
		return await db.none(sqlFile('game/start_game.sql'), { id });
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
