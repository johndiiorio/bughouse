app.controller('gameController', function ($scope) {
    var yourTimer, yourOpponentTimer, opponentAcrossTimer, teammateTimer;

    //Hard coded tests for UI, use AJAX for production
    $scope.game = {};
    $scope.game.minutes = 5;
    $scope.game.increment = 10;
    $scope.game.mode = "Casual";
    $scope.game.player1 = {username: "Xivister", rating: 1623};
    $scope.game.player2 = {username: "someguy86", rating: 1462};
    $scope.game.player3 = {username: "scrublord3", rating: 1363};
    $scope.game.player4 = {username: "superGM", rating: 2753};

    var yourDisplay = $('#yourTime'),
        yourOpponentDisplay = $('#yourOpponentTime'),
        opponentAcrossDisplay = $('#opponentAcrossTime'),
        teammateAcrossDisplay = $('#teammateTime');

    var moves = [];
    var leftCount = 1;
    var rightCount = 1;

    jQuery(function ($) {
        yourTimer = new CountDownTimer($scope.game.minutes * 60, $scope.game.increment);
        yourOpponentTimer = new CountDownTimer($scope.game.minutes * 60, $scope.game.increment);
        opponentAcrossTimer = new CountDownTimer($scope.game.minutes * 60, $scope.game.increment);
        teammateTimer = new CountDownTimer($scope.game.minutes * 60, $scope.game.increment);

        yourTimer.onTick(format(yourDisplay));
        yourOpponentTimer.onTick(format(yourOpponentDisplay));
        opponentAcrossTimer.onTick(format(opponentAcrossDisplay));
        teammateTimer.onTick(format(teammateAcrossDisplay));

        yourTimer.start();
        opponentAcrossTimer.start();

        function format(display) {
            return function (minutes, seconds) {
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                display.text(minutes + ':' + seconds);
            };
        }
    });

    var gameLeft = function () {
        var board, game = new Chess(), statusEl = $('#status1'), fenEl = $('#fen1');

        var onDragStart = function (source, piece, position, orientation) {
            if (game.game_over() === true ||
                (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
        };
        var onDrop = function (source, target, piece) {
            // see if the move is legal
            var move;
            if (source == "spare") {
                move = game.move(piece.charAt(1) + "@" + target);
            } else {
                move = game.move({
                    from: source,
                    to: target,
                    promotion: 'q' // NOTE: always promote to a queen for example simplicity
                });
            }

            // illegal move
            if (move === null) return 'snapback';

            if (game.turn() === 'b') {
                moves.push(" " + leftCount + "A. " + game.history());
            } else {
                moves.push(" " + leftCount + "a. " + game.history());
                leftCount += 1;
            }

            if (game.turn() === 'b') {
                var sparePiecesArr = [];
                for (var i = 0; i < game.reserve_white.length; i++) {
                    if (game.reserve_white[i].type == 'p') {
                        sparePiecesArr.push('wP');
                    }
                    else if (game.reserve_white[i].type == 'n') {
                        sparePiecesArr.push('wN');
                    }
                    else if (game.reserve_white[i].type == 'b'){
                        sparePiecesArr.push('wB');
                    }
                    else if (game.reserve_white[i].type == 'r') {
                        sparePiecesArr.push('wR');
                    }
                    else if (game.reserve_white[i].type == 'q') {
                        sparePiecesArr.push('wQ');
                    }
                }
                board.updateSparePieces("white", sparePiecesArr);
            } else {
                var sparePiecesArr = [];
                for (var i = 0; i < game.reserve_black.length; i++) {
                    if (game.reserve_black[i].type == 'p') {
                        sparePiecesArr.push('bP');
                    }
                    else if (game.reserve_black[i].type == 'n') {
                        sparePiecesArr.push('bN');
                    }
                    else if (game.reserve_black[i].type == 'b') {
                        sparePiecesArr.push('bB');
                    }
                    else if (game.reserve_black[i].type == 'r') {
                        sparePiecesArr.push('bR');
                    }
                    else if (game.reserve_black[i].type == 'q') {
                        sparePiecesArr.push('bQ');
                    }
                }
                board.updateSparePieces("black", sparePiecesArr);
            }

            yourOpponentTimer.toggle();
            yourTimer.toggle();
            updateStatus();
        };
        var onSnapEnd = function () {
            board.position(game.fen());
        };
        var updateStatus = function () {
            $('#pgn').html(moves);
        };
        var cfg = {
            draggable: true,
            position: 'start',
            sparePieces: true,
            showNotation: false,
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
        board = ChessBoard('board1', cfg);
        updateStatus();
    };
    var gameRight = function () {
        var board, game = new Chess(), statusEl = $('#status2'), fenEl = $('#fen2');

        var onDragStart = function (source, piece, position, orientation) {
            if (game.game_over() === true ||
                (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
        };
        var onDrop = function (source, target, piece) {
            // see if the move is legal
            var move;
            if(source == "spare") {
                move = game.move(piece.charAt(1) + "@" + target);
            } else {
                move = game.move({
                    from: source,
                    to: target,
                    promotion: 'q' // NOTE: always promote to a queen for example simplicity
                });
            }
            // illegal move
            if (move === null) return 'snapback';

            if (game.turn() === 'b') {
                moves.push(" " + rightCount + "B. " + game.history());
            } else {
                moves.push(" " + rightCount + "b. " + game.history());
                rightCount += 1;
            }

            if (game.turn() === 'b') {
                var sparePiecesArr = [];
                for (var i = 0; i < game.reserve_white.length; i++) {
                    if (game.reserve_white[i].type == 'p') {
                        sparePiecesArr.push('wP');
                    }
                    else if (game.reserve_white[i].type == 'n') {
                        sparePiecesArr.push('wN');
                    }
                    else if (game.reserve_white[i].type == 'b'){
                        sparePiecesArr.push('wB');
                    }
                    else if (game.reserve_white[i].type == 'r') {
                        sparePiecesArr.push('wR');
                    }
                    else if (game.reserve_white[i].type == 'q') {
                        sparePiecesArr.push('wQ');
                    }
                }
                board.updateSparePieces("white", sparePiecesArr);
            } else {
                var sparePiecesArr = [];
                for (var i = 0; i < game.reserve_black.length; i++) {
                    if (game.reserve_black[i].type == 'p') {
                        sparePiecesArr.push('bP');
                    }
                    else if (game.reserve_black[i].type == 'n') {
                        sparePiecesArr.push('bN');
                    }
                    else if (game.reserve_black[i].type == 'b') {
                        sparePiecesArr.push('bB');
                    }
                    else if (game.reserve_black[i].type == 'r') {
                        sparePiecesArr.push('bR');
                    }
                    else if (game.reserve_black[i].type == 'q') {
                        sparePiecesArr.push('bQ');
                    }
                }
                board.updateSparePieces("black", sparePiecesArr);
            }

            opponentAcrossTimer.toggle();
            teammateTimer.toggle();
            updateStatus();
        };
        var onSnapEnd = function () {
            board.position(game.fen());
        };
        var updateStatus = function () {
            $('#pgn').html(moves);
        };
        var cfg = {
            draggable: true,
            position: 'start',
            sparePieces: true,
            showNotation: false,
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
        board = ChessBoard('board2', cfg);
        board.flip();
        updateStatus();
    };

    $(document).ready(gameLeft);
    $(document).ready(gameRight);

    $scope.getInfoFormat = function (minutes) {
        if (minutes < 3) return "Bullet";
        else if (minutes >= 3 && minutes <= 8) return "Blitz";
        else return "Classical";
    };
    $scope.getDurationFormat = function (duration) {
        var minutes = Math.floor(duration / 60);
        var seconds = duration % 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return minutes + ":" + seconds;
    };

    //Update game every 10 ms
    //window.setInterval(function(){
    //    console.log(moves);
    //}, 10);
});