const Game = require('../models/Game');
const database = require('../models/database');

const db = database.db;

/**
 * Check if any user has timed out in a game
 * @param {Game} game - Game row from database
 * @returns {String} - Returns empty string if game is still going, otherwise returns termination string
 */
function checkIfTimeOut(game) {
	const currentTime = Date.now();
	for (let userPosition = 1; userPosition <= 4; userPosition++) {
		const diffTime = currentTime - (userPosition === 1 || userPosition === 2 ? game.left_last_time : game.right_last_time);
		if (diffTime + game.clocks.split(',').map(Number)[userPosition - 1] >= game.minutes * 1000 * 60) {
			if (userPosition === 1 || userPosition === 4) {
				return 'Team 1 timed out, Team 2 is victorious';
			} else if (userPosition === 2 || userPosition === 3) {
				return 'Team 2 timed out, Team 1 is victorious';
			}
		}
	}
	return '';
}

module.exports = async (id, socket, gameSocket) => {
	try {
		const game = await Game.getByID(id);
		if (game && game.status === 'playing') {
			const termination = checkIfTimeOut(game);
			if (termination) {
				const terminationQueryString = 'UPDATE Games SET termination = $1, status = $2 WHERE id = $3';
				await db.none(terminationQueryString, [termination, 'terminated', id]);
				gameSocket.in(socket.room).emit('game over', { termination });
			}
		}
	} catch (err) {
		console.log(`Error handling timeOut for game id ${id}: ${err}`);
	}
};
