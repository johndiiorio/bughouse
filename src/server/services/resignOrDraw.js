const Game = require('../models/Game');
const database = require('../models/database');
const logger = require('../logger');

const db = database.db;

async function offerResign(data, socket) {
	try {
		const row = await Game.getByID(data.id);
		const resignState = row.resign_state.split(',').map(Number);
		resignState[data.userPosition - 1] = 1;
		await db.none('UPDATE Games SET resign_state = $1 WHERE id = $2', [resignState.join(), data.id]);
		socket.to(socket.room).emit('offer resign', data.userPosition);
	} catch (err) {
		logger.error(`Error handling offerResign for game id ${data.id}: ${err}`);
	}
}

async function offerDraw(data, socket) {
	try {
		const row = await Game.getByID(data.id);
		const drawState = row.draw_state.split(',').map(Number);
		drawState[data.userPosition - 1] = 1;
		await db.none('UPDATE Games SET draw_state = $1 WHERE id = $2', [drawState.join(), data.id]);
		socket.to(socket.room).emit('offer draw');
	} catch (err) {
		logger.error(`Error handling offerDraw for game id ${data.id}: ${err}`);
	}
}

async function acceptResign(data, socket, gameSocket, clearRoom) {
	try {
		const row = await Game.getByID(data.id);
		const resignState = row.resign_state.split(',').map(Number);
		let resignedAgreed = false;
		let termination = 'Team 1 Resigned, Team 2 is victorious';
		if (data.userPosition === 1 && resignState[3] === 1) {
			resignedAgreed = true;
		} else if (data.userPosition === 2 && resignState[2] === 1) {
			resignedAgreed = true;
			termination = 'Team 2 Resigned, Team 1 is victorious';
		} else if (data.userPosition === 3 && resignState[1] === 1) {
			resignedAgreed = true;
			termination = 'Team 2 Resigned, Team 1 is victorious';
		} else if (data.userPosition === 4 && resignState[0] === 1) {
			resignedAgreed = true;
		}
		if (resignedAgreed) {
			await Game.endGame(row, termination, socket, gameSocket, clearRoom);
		}
	} catch (err) {
		logger.error(`Error updating acceptResign for game id ${data.id}: ${err}`);
	}
}

async function declineResign(data, socket, gameSocket) {
	try {
		const row = await Game.getByID(data.id);
		const resignState = row.resign_state.split(',').map(Number);
		if (data.userPosition === 1 || data.userPosition === 4) {
			resignState[0] = 0;
			resignState[3] = 0;
		} else {
			resignState[1] = 0;
			resignState[2] = 0;
		}
		await db.none('UPDATE Games SET resign_state = $1 WHERE id = $2', [resignState.join(), data.id]);
		gameSocket.in(socket.room).emit('decline resign', data.userPosition);
	} catch (err) {
		logger.error(`Error handling declineResign for game id ${data.id}: ${err}`);
	}
}

async function acceptDraw(data, socket, gameSocket, clearRoom) {
	try {
		const row = await Game.getByID(data.id);
		const drawState = row.draw_state.split(',').map(Number);
		drawState[data.userPosition - 1] = 1;
		let drawAgreed = true;
		for (const element of drawState) {
			if (element !== 1) drawAgreed = false;
		}
		if (drawAgreed) {
			const termination = 'Draw by agreement';
			await Game.endGame(row, termination, socket, gameSocket, clearRoom);
		}
		await db.none('UPDATE Games SET draw_state = $1 WHERE id = $2', [drawState.join(), data.id]);
	} catch (err) {
		logger.error(`Error updating acceptDraw for game id ${data.id}: ${err}`);
	}
}

async function declineDraw(data, socket, gameSocket) {
	try {
		await db.none('UPDATE Games SET draw_state = $1 WHERE id = $2', ['0,0,0,0', data.id]);
		gameSocket.in(socket.room).emit('decline draw');
	} catch (err) {
		logger.error(`Error handling declineDraw for game id ${data.id}: ${err}`);
	}
}

module.exports = {
	offerResign,
	offerDraw,
	acceptResign,
	declineResign,
	acceptDraw,
	declineDraw
};
