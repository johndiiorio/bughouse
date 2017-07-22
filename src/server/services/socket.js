const Game = require('../models/Game');
const updateGame = require('./updateGame');
const resignOrDraw = require('./resignOrDraw');

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
			updateGame(data, socket, gameSocket);
		});
		socket.on('offer resign', data => {
			resignOrDraw.offerResign(data, socket);
		});
		socket.on('offer draw', data => {
			resignOrDraw.offerDraw(data, socket);
		});
		socket.on('accept resign', data => {
			resignOrDraw.acceptResign(data, socket, gameSocket);
		});
		socket.on('decline resign', data => {
			resignOrDraw.declineResign(data, socket, gameSocket);
		});
		socket.on('accept draw', data => {
			resignOrDraw.acceptDraw(data, socket, gameSocket);
		});
		socket.on('decline draw', data => {
			resignOrDraw.declineDraw(data, socket, gameSocket);
		});
	});
};
