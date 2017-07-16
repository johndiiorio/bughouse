const Game = require('../models/Game');
const database = require('../models/database');

const db = database.db;

async function offerResign(data, socket) {
	try {
		const row = await Game.getByID(data.id);
		const resignState = row.resign_state.split(',').map(Number);
		resignState[data.userPosition - 1] = 1;
		await db.none('UPDATE Games SET resign_state = $1 WHERE id = $2', [resignState.join(), data.id]);
		socket.to(socket.room).emit('offer resign', data.userPosition);
	} catch (err) {
		console.log(`Error updating resign_state for game id ${data.id}: ${err}`);
	}
}

async function offerDraw(data, socket) {

}

async function acceptResign(data, socket) {

}

async function declineResign(data, socket) {

}

async function acceptDraw(data, socket) {

}

async function declineDraw(data, socket) {

}

module.exports = {
	offerResign,
	offerDraw,
	acceptResign,
	declineResign,
	acceptDraw,
	declineDraw
};
