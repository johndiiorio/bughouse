var pool = require('./../../models/pool').pool;
var updateGame = require('./updateGame');

module.exports = function(io) {
    var lobbySocket = io.of('/lobby');
    var loadingSocket = io.of('/loading');
    var gameSocket = io.of('/game');
    lobbySocket.on('connection', function(socket) {
        socket.on('update game list', function () {
            socket.broadcast.emit('update game list');
        });
    });
    loadingSocket.on('connection', function(socket) {
        /* Join the user to the correct game room */
        socket.on('room', function(room) {
            // Leave room if user joins different room
            if (socket.room) {
                socket.leave(socket.room);
            }
            socket.room = room;
            socket.join(room);
        });
        socket.on('begin game', function () {
            socket.broadcast.emit('begin game');
        });
    });
    gameSocket.on('connection', function(socket) {
        /* Join the user to the correct game room */
        socket.on('room', function(room) {
            // Leave room if user joins different room
            if (socket.room) {
                socket.leave(socket.room);
            }
            socket.room = room;
            socket.join(room);
        });
        /* Update a game's moves */
        socket.on('update moves', function (data) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    connection.release();
                    console.log('Error in connection to database via Socket.io');
                    return;
                }
                connection.query("UPDATE Games SET moves = ? WHERE game_id = ?", [data.moves, data.game_id], function (err) {
                    connection.release();
                    if (!err) {
                        socket.broadcast.to(socket.room).emit('update moves', data.moves);
                    }
                    else {
                        console.log('Error while performing query via Socket.io');
                    }
                });
                connection.on('error', function (err) {
                    console.log('Error in connection to database via Socket.io');
                });
            });
        });
        /* Update a game's reserve */
        socket.on('update reserve', function (data) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    connection.release();
                    console.log('Error in connection to database via Socket.io');
                    return;
                }
                connection.query("UPDATE Games SET ?? = ? WHERE game_id = ?", [data.reserve, data.pieces, data.game_id], function (err) {
                    connection.release();
                    if (!err) {
                        // send to all clients in 'game' room(channel) except sender
                        socket.broadcast.to(socket.room).emit('update reserve', data);
                    }
                    else {
                        console.log('Error while performing query via Socket.io');
                    }
                });
                connection.on('error', function (err) {
                    console.log('Error in connection to database via Socket.io');
                });
            });
        });
        /* Validate move and update game */
        socket.on('update game', function (data) {
            updateGame(data, socket, gameSocket, io);
        });
    });
};