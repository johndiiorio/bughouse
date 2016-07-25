var pool = require('./../../models/pool').pool;
var Bug = require('./bug');

/* Beware all ye who enter here
   Untold evils and unspeakable creatures live here
   Enter at your own risk and clutch tight your sanity
   "The oldest and strongest emotion of mankind is fear,
   and the oldest and strongest kind of fear is fear of the unknown.
   If you know the enemy and know yourself you need not fear the results of the God Function." */
module.exports = function(data, socket, gameSocket, io) {
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
        return {moves: moves, moveNum: moveCount};
    }
    function convertReserveToSparePieces(reserve) {
        var convertedArray = [];
        reserve = JSON.parse(reserve);
        for (var i = 0; i < reserve.length; i++) {
            convertedArray.push(reserve[i].color + reserve[i].type.toUpperCase());
        }
        return convertedArray;
    }
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log('Error in connection to database in socket.js');
            return;
        }
        connection.query("SELECT * FROM Games WHERE game_id = ?", [data.game_id], function (err, rows) {
            var currentTime = Date.now();
            var row = rows[0];
            if (err) { console.log('Error while performing SELECT Games query in socket.js'); }
            else {
                row.left_reserve_white = row.left_reserve_white ? JSON.parse(row.left_reserve_white) : [];
                row.left_reserve_black = row.left_reserve_black ? JSON.parse(row.left_reserve_black) : [];
                row.right_reserve_white = row.right_reserve_white ? JSON.parse(row.right_reserve_white) : [];
                row.right_reserve_black = row.right_reserve_black ? JSON.parse(row.right_reserve_black) : [];
                var game, move;
                if (data.fkNum == 1 || data.fkNum == 2) { // Create game for left board
                    game = new Bug(row.left_fen);
                    game.setReserves(row.left_reserve_white, row.left_reserve_black);
                } else { // Create game for right board
                    game = new Bug(row.right_fen);
                    game.setReserves(row.right_reserve_white, row.right_reserve_black);
                }
                if (data.move.source == "spare") {
                    move = game.move(data.move.piece.charAt(1) + "@" + data.move.target);
                } else {
                    move = game.move({
                        from: data.move.source,
                        to: data.move.target,
                        promotion: data.move.promotion
                    });
                }
                if (move) { // Not an illegal move
                    var query_string = "UPDATE Games SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE game_id = ?";
                    var args_query,
                        boardNum,
                        emitData,
                        diffTime,
                        arg_other_reserve_white = [],
                        arg_other_reserve_black = [],
                        arg_fen = game.fen(),
                        capture = false;
                    if (game.history()[0].indexOf('x') != -1) { // Move is a capture
                        capture = true;
                    }
                    var newReserves = game.getReserves();
                    var moveInfo = newMoveString(row.moves, data.fkNum, game);
                    var arg_moves = moveInfo.moves;
                    var moveNum = moveInfo.moveNum;
                    var arg_reserve_white = JSON.stringify(newReserves.reserve_white);
                    var arg_reserve_black = JSON.stringify(newReserves.reserve_black);
                    var arrClocks = row.clocks.split(',').map(Number);
                    row.increment *= 1000; // convert seconds to milliseconds
                    if (data.fkNum == 1 || data.fkNum == 2) {
                        boardNum = 1;
                        arg_other_reserve_white = JSON.stringify(row.right_reserve_white.concat(newReserves.other_reserve_white));
                        arg_other_reserve_black = JSON.stringify(row.right_reserve_black.concat(newReserves.other_reserve_black));
                        diffTime = moveNum != 1 ? currentTime - row.last_time_left : row.increment; // don't change clock if first move
                        if (data.fkNum == 1) {
                            arrClocks[0] += diffTime - row.increment;
                        } else {
                            arrClocks[1] += diffTime - row.increment;
                        }
                        row.clocks = arrClocks.join();
                        args_query = ['left_fen', arg_fen,
                            'left_reserve_white', arg_reserve_white,
                            'left_reserve_black', arg_reserve_black,
                            'right_reserve_white', arg_other_reserve_white,
                            'right_reserve_black', arg_other_reserve_black,
                            'last_time_left', currentTime,
                            'moves', arg_moves,
                            'clocks', row.clocks,
                            data.game_id];
                        emitData = {
                            fen: arg_fen,
                            left_reserve_white: convertReserveToSparePieces(arg_reserve_white),
                            left_reserve_black: convertReserveToSparePieces(arg_reserve_black),
                            right_reserve_white: convertReserveToSparePieces(arg_other_reserve_white),
                            right_reserve_black: convertReserveToSparePieces(arg_other_reserve_black),
                            turn: game.turn(),
                            boardNum: boardNum,
                            move: data.move,
                            moves: arg_moves,
                            capture: capture,
                            clocks: row.clocks
                        };
                    } else {
                        boardNum = 2;
                        arg_other_reserve_white = JSON.stringify(row.left_reserve_white.concat(newReserves.other_reserve_white));
                        arg_other_reserve_black = JSON.stringify(row.left_reserve_black.concat(newReserves.other_reserve_black));
                        diffTime = moveNum != 1 ? currentTime - row.last_time_left : row.increment; // don't change clock if first move
                        if (data.fkNum == 3) {
                            arrClocks[2] += diffTime - row.increment;
                        } else {
                            arrClocks[3] += diffTime - row.increment;
                        }
                        row.clocks = arrClocks.join();
                        args_query = ['right_fen', arg_fen,
                            'right_reserve_white', arg_reserve_white,
                            'right_reserve_black', arg_reserve_black,
                            'left_reserve_white', arg_other_reserve_white,
                            'left_reserve_black', arg_other_reserve_black,
                            'moves', arg_moves,
                            'last_time_right', currentTime,
                            'clocks', row.clocks,
                            data.game_id];
                        emitData = {
                            fen: arg_fen,
                            left_reserve_white: convertReserveToSparePieces(arg_other_reserve_white),
                            left_reserve_black: convertReserveToSparePieces(arg_other_reserve_black),
                            right_reserve_white: convertReserveToSparePieces(arg_reserve_white),
                            right_reserve_black: convertReserveToSparePieces(arg_reserve_black),
                            turn: game.turn(),
                            boardNum: boardNum,
                            move: data.move,
                            moves: arg_moves,
                            capture: capture,
                            clocks: row.clocks
                        };
                    }
                    connection.query(query_string, args_query, function (err) {
                        connection.release();
                        if (!err) { // update everyone in game
                            gameSocket.in(socket.room).emit('update game', emitData);
                        } else {
                            console.log('Error while performing update query in socket.js');
                            socket.emit('snapback move', {fen: game.fen()});
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
        connection.on('error', function () {
            console.log('Error in connection to database in socket.js');
            socket.emit('snapback move', {fen: game.fen()});
        });
    });
};