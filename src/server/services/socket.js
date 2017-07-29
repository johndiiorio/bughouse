const Game = require('../models/Game');
const updateGame = require('./updateGame');
const timeOut = require('./timeOut');
const resignOrDraw = require('./resignOrDraw');

module.exports = io => {
	const lobbySocket = io.of('/lobby');
	const loadingSocket = io.of('/loading');
	const gameSocket = io.of('/game');

	function clearRoom(room, namespace = '/') {
		const roomObj = io.nsps[namespace].adapter.rooms[room];
		if (roomObj) {
			Object.keys(roomObj.sockets).forEach(id => {
				io.sockets.connected[id].leave(room);
			});
		}
	}

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
				clearRoom(room, '/loading');
			}
		});
	});
	gameSocket.on('connection', socket => {
		socket.on('room', room => {
			socket.room = room;
			socket.join(room);
		});
		socket.on('update game', data => {
			updateGame(data, socket, gameSocket, clearRoom);
		});
		socket.on('time out', data => {
			timeOut(data, socket, gameSocket, clearRoom);
		});
		socket.on('offer resign', data => {
			resignOrDraw.offerResign(data, socket);
		});
		socket.on('offer draw', data => {
			resignOrDraw.offerDraw(data, socket);
		});
		socket.on('accept resign', data => {
			resignOrDraw.acceptResign(data, socket, gameSocket, clearRoom);
		});
		socket.on('decline resign', data => {
			resignOrDraw.declineResign(data, socket, gameSocket);
		});
		socket.on('accept draw', data => {
			resignOrDraw.acceptDraw(data, socket, gameSocket, clearRoom);
		});
		socket.on('decline draw', data => {
			resignOrDraw.declineDraw(data, socket, gameSocket);
		});
	});
};
