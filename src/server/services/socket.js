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
			updateGame(data, socket);
		});
		socket.on('offer resign', data => {
			resignOrDraw.offerResign(data, socket, gameSocket);
		});
		socket.on('offer draw', data => {

		});
		socket.on('accept resign', data => {

		});
		socket.on('decline resign', data => {

		});
		socket.on('accept draw', data => {

		});
		socket.on('decline draw', data => {

		});
	});
};
