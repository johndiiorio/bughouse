var pool = require('./../../models/pool').pool;
var Bug = require('./bug');

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
            function newMoveString(moves, fkNum, game) {
                if (!moves) moves = "";
                var moveCount, lastPlayerLetter;
                if (fkNum == 1) lastPlayerLetter = moves.lastIndexOf("A.");
                else if (fkNum == 2) lastPlayerLetter = moves.lastIndexOf("a.");
                else if (fkNum == 3) lastPlayerLetter = moves.lastIndexOf("B.");
                else lastPlayerLetter = moves.lastIndexOf("b.");
                if (lastPlayerLetter == -1) moveCount = 1;
                else {
                    var lastSpace = moves.substring(0, lastPlayerLetter).lastIndexOf(" ");
                    var loopSubstring = moves.substring(lastSpace + 1, lastPlayerLetter);
                    var beginNum = 0;
                    for (; beginNum < loopSubstring.length; beginNum++) {
                        if (!isNaN(loopSubstring[beginNum])) break;
                    }
                    moveCount = parseInt(moves.substring(lastSpace + beginNum + 1, lastPlayerLetter)) + 1;
                }
                if (fkNum == 1) {
                    moves += moveCount + "A. " + game.history() + " ";
                } else if (fkNum == 2) {
                    moves += moveCount + "a. " + game.history() + " ";
                } else if (fkNum == 3) {
                    moves += moveCount + "B. " + game.history() + " ";
                } else {
                    moves += moveCount + "b. " + game.history() + " ";
                }
                return moves;
            }
            pool.getConnection(function (err, connection) {
                if (err) {
                    connection.release();
                    console.log('Error in connection to database in socket.js');
                    return;
                }
                connection.query("SELECT * FROM Games WHERE game_id = ?", [data.game_id], function (err, rows) {
                    if (err) { console.log('Error while performing SELECT Games query in socket.js'); }
                    else {
                        var game, move;
                        if (data.fkNum == 1 || data.fkNum == 2) { // Create game for left board
                            game = new Bug(rows[0].left_fen);
                            game.setReserves(rows[0].left_reserve_white, rows[0].left_reserve_black);
                        } else { // Create game for right board
                            game = new Bug(rows[0].right_fen);
                            game.setReserves(rows[0].right_reserve_white, rows[0].right_reserve_black);
                        }
                        if (data.source == "spare") {
                            move = game.move(data.move.piece.charAt(1) + "@" + data.move.target);
                        } else {
                            move = game.move({
                                from: data.move.source,
                                to: data.move.target,
                                promotion: data.move.promotion
                            });
                        }
                        if (move) { // Not an illegal move
                            var queryString = "UPDATE Games SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE game_id = ?";
                            var queryArgs, arg_moves = "", arg_reserve_white = [], arg_reserve_black = [], arg_fen = game.fen(), capture = false;
                            var boardNum;
                            arg_moves = newMoveString(rows[0].moves, data.fkNum, game);
                            for (var i = 0; i < game.reserve_white; i++) {
                                arg_reserve_white[i] = JSON.stringify(game.reserve_white[i]);
                            }
                            for (var j = 0; j < game.reserve_black; j++) {
                                arg_reserve_black[i] = JSON.stringify(game.reserve_black[i]);
                            }
                            if (data.fkNum == 1 || data.fkNum == 2) {
                                boardNum = 1;
                                queryArgs = ['left_fen', arg_fen, 'left_reserve_white', arg_reserve_white.toString(), 'left_reserve_black', arg_reserve_black.toString(), 'moves', arg_moves, data.game_id];
                            } else {
                                boardNum = 2;
                                queryArgs = ['right_fen', arg_fen, 'right_reserve_white', arg_reserve_white.toString(), 'right_reserve_black', arg_reserve_black.toString(), 'moves', arg_moves, data.game_id];
                            }
                            if (game.history()[0].indexOf('x') != -1) {
                                capture = true;
                            }
                            connection.query(queryString, queryArgs, function (err) {
                                connection.release();
                                if (!err) { // update everyone in game
                                    var emitData = {
                                        fen: arg_fen,
                                        reserve_white: arg_reserve_white,
                                        reserve_black: arg_reserve_black,
                                        turn: game.turn(),
                                        boardNum: boardNum,
                                        move: data.move,
                                        moves: arg_moves,
                                        capture: capture
                                    };
                                    gameSocket.in(socket.room).emit('update game', emitData);
                                } else {
                                    console.log('Error while performing update query in socket.js');
                                }
                                // TODO add game over support
                                if (game.game_over()) {
                                    io.in(socket.room).emit('game over', {termination: "TODO"});
                                }
                            });
                        } else { // Illegal move, send an invalid move error back to sender
                            connection.release();
                            socket.emit('snapback move', {fen: game.fen()});
                        }
                    }
                });
                connection.on('error', function (err) {
                    console.log('Error in connection to database in socket.js');
                });
            });
        });
    });
};