// const pool = require('../models/pool').pool;
const updateGame = require('./updateGame');

module.exports = function (io) {
	const lobbySocket = io.of('/lobby');
	const loadingSocket = io.of('/loading');
	const gameSocket = io.of('/game');
	lobbySocket.on('connection', socket => {
		socket.on('update game list', () => {
			socket.broadcast.emit('update game list');
		});
	});
	loadingSocket.on('connection', socket => {
        /* Join the user to the correct game room */
		socket.on('room', room => {
            // Leave room if user joins different room
			if (socket.room) {
				socket.leave(socket.room);
			}
			socket.room = room;
			socket.join(room);
		});
		socket.on('begin game', () => {
			socket.broadcast.emit('begin game');
		});
	});
	gameSocket.on('connection', socket => {
        /* Join the user to the correct game room */
		socket.on('room', room => {
            // Leave room if user joins different room
			if (socket.room) {
				socket.leave(socket.room);
			}
			socket.room = room;
			socket.join(room);
		});
        /* Update a game's moves */
		socket.on('update moves', data => {
			pool.getConnection((err, connection) => {
				if (err) {
					connection.release();
					console.log('Error in connection to database via Socket.io');
					return;
				}
				connection.query('UPDATE Games SET moves = ? WHERE game_id = ?', [data.moves, data.game_id], err => {
					connection.release();
					if (!err) {
						socket.broadcast.to(socket.room).emit('update moves', data.moves);
					} else {
						console.log('Error while performing query via Socket.io');
					}
				});
				connection.on('error', err => {
					console.log('Error in connection to database via Socket.io');
				});
			});
		});
        /* Update a game's reserve */
		socket.on('update reserve', data => {
			pool.getConnection((err, connection) => {
				if (err) {
					connection.release();
					console.log('Error in connection to database via Socket.io');
					return;
				}
				connection.query('UPDATE Games SET ?? = ? WHERE game_id = ?', [data.reserve, data.pieces, data.game_id], err => {
					connection.release();
					if (!err) {
                        // send to all clients in 'game' room(channel) except sender
						socket.broadcast.to(socket.room).emit('update reserve', data);
					} else {
						console.log('Error while performing query via Socket.io');
					}
				});
				connection.on('error', err => {
					console.log('Error in connection to database via Socket.io');
				});
			});
		});
        /* Validate move and update game */
		socket.on('update game', data => {
			updateGame(data, socket, gameSocket, io);
		});
	});
};
