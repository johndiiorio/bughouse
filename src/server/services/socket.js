const jwt = require('jsonwebtoken');
const Game = require('../models/Game');
const updateGame = require('./updateGame');
const timeOut = require('./timeOut');
const resignOrDraw = require('./resignOrDraw');
const secretToken = require('../config').secretToken;

module.exports = io => {
	const lobbySocket = io.of('/lobby');
	const loadingSocket = io.of('/loading');
	const gameSocket = io.of('/game');

	function clearRoom(room, namespace = '/') {
		const roomObj = io.nsps[namespace].adapter.rooms[room];
		if (roomObj) {
			Object.keys(roomObj.sockets).forEach(id => {
				io.nsps[namespace].connected[id].leave(room);
			});
		}
	}

	async function checkIfUserInGame(id, token) {
		try {
			if (!token || !id) return false;
			const row = await Game.getGameWithUsersByID(id);
			if (row.status !== 'playing') {
				return false;
			}
			const decoded = jwt.verify(token, secretToken);
			return row.player1.id === decoded.id || row.player2.id === decoded.id || row.player3.id === decoded.id || row.player4.id === decoded.id;
		} catch (err) {
			return false;
		}
	}

	lobbySocket.on('connection', socket => {
		socket.on('update game list', () => {
			socket.broadcast.emit('update game list');
		});
	});

	loadingSocket.on('connection', socket => {
		socket.on('room', async room => {
			if (room) {
				socket.join(room);
				const gameStarted = await Game.tryToStartGame(room);
				if (gameStarted) {
					loadingSocket.in(room).emit('start game', room);
					clearRoom(room, '/loading');
				}
			}
		});
	});

	gameSocket.on('connection', socket => {
		socket.on('room', room => {
			if (room) {
				socket.room = room;
				socket.join(room);
			}
		});
		socket.on('update game', async data => {
			const userInGame = await checkIfUserInGame(data.id, data.token);
			if (userInGame) {
				await updateGame(data, socket, gameSocket, clearRoom);
			}
		});
		socket.on('time out', async data => {
			const userInGame = await checkIfUserInGame(data.id, data.token);
			if (userInGame) {
				await timeOut(data.id, socket, gameSocket, clearRoom);
			}
		});
		socket.on('offer resign', async data => {
			const userInGame = await checkIfUserInGame(data.id, data.token);
			if (userInGame) {
				await resignOrDraw.offerResign(data, socket);
			}
		});
		socket.on('offer draw', async data => {
			const userInGame = await checkIfUserInGame(data.id, data.token);
			if (userInGame) {
				await resignOrDraw.offerDraw(data, socket);
			}
		});
		socket.on('accept resign', async data => {
			const userInGame = await checkIfUserInGame(data.id, data.token);
			if (userInGame) {
				await resignOrDraw.acceptResign(data, socket, gameSocket, clearRoom);
			}
		});
		socket.on('decline resign', async data => {
			const userInGame = await checkIfUserInGame(data.id, data.token);
			if (userInGame) {
				await resignOrDraw.declineResign(data, socket, gameSocket);
			}
		});
		socket.on('accept draw', async data => {
			const userInGame = await checkIfUserInGame(data.id, data.token);
			if (userInGame) {
				await resignOrDraw.acceptDraw(data, socket, gameSocket, clearRoom);
			}
		});
		socket.on('decline draw', async data => {
			const userInGame = await checkIfUserInGame(data.id, data.token);
			if (userInGame) {
				await resignOrDraw.declineDraw(data, socket, gameSocket);
			}
		});
	});
};
