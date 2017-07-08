const Game = require('../models/Game');
const updateGame = require('./updateGame');

module.exports = io => {
	const lobbySocket = io.of('/lobby');
	const loadingSocket = io.of('/loading');
	const gameSocket = io.of('/game');
	lobbySocket.on('connection', socket => {
		socket.on('update game list', () => {
			socket.broadcast.emit('update game list');
		});
	});
	loadingSocket.on('connection', socket => {
		socket.on('room', async room => {
			socket.join(room);
			const gameStarted = await Game.tryToStartGame(room);
			if (gameStarted) {
				io.of('/loading').in(room).emit('start game', room);
			}
		});
	});
	gameSocket.on('connection', socket => {
		socket.on('room', room => {
			socket.room = room;
			socket.join(room);
		});
		socket.on('update game', data => {
			updateGame(data, socket, gameSocket, io);
		});
	});
};
