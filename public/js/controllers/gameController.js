app.controller('gameController', function ($scope) {
    var yourTimer, yourOpponentTimer, opponentAcrossTimer, teammateTimer;

    //Hard coded tests for UI, use AJAX for production
    $scope.game = {};
    $scope.game.time_control = "246+5";
    $scope.game.mode = "Casual";
    $scope.game.player1 = {username: "Xivister", rating: 1623};
    $scope.game.player2 = {username: "someguy86", rating: 1462};
    $scope.game.player3 = {username: "scrublord3", rating: 1363};
    $scope.game.player4 = {username: "superGM", rating: 2753};

    $scope.game.duration = $scope.game.time_control.substring(0, $scope.game.time_control.indexOf("+"));
    $scope.game.increment = $scope.game.time_control.substring($scope.game.time_control.indexOf("+") + 1);

    jQuery(function ($) {
        var yourDisplay = $('#yourTime'),
            yourOpponentDisplay = $('#yourOpponentTime'),
            opponentAcrossDisplay = $('#opponentAcrossTime'),
            teammateAcrossDisplay = $('#teammateTime');

        yourTimer = new CountDownTimer($scope.game.duration);
        yourOpponentTimer = new CountDownTimer($scope.game.duration);
        opponentAcrossTimer = new CountDownTimer($scope.game.duration);
        teammateTimer = new CountDownTimer($scope.game.duration);

        yourTimer.onTick(format(yourDisplay));
        yourOpponentTimer.onTick(format(yourOpponentDisplay));
        opponentAcrossTimer.onTick(format(opponentAcrossDisplay));
        teammateTimer.onTick(format(teammateAcrossDisplay));

        yourTimer.start();
        teammateTimer.start();

        function format(display) {
            return function (minutes, seconds) {
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                display.text(minutes + ':' + seconds);
            };
        }
    });

    var gameLeft = function () {
        var board, game = new Chess(), statusEl = $('#status1'), fenEl = $('#fen1'), pgnEl = $('#pgn1');

        var onDragStart = function (source, piece, position, orientation) {
            if (game.game_over() === true ||
                (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
        };
        var onDrop = function (source, target) {
            // see if the move is legal
            var move = game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });

            // illegal move
            if (move === null) return 'snapback';

            yourOpponentTimer.toggle();
            yourTimer.toggle();
            updateStatus();
        };
        var onSnapEnd = function () {
            board.position(game.fen());
        };
        var updateStatus = function () {
            var status = '';
            var moveColor = 'White';
            if (game.turn() === 'b') {
                moveColor = 'Black';
            }
            // checkmate?
            if (game.in_checkmate() === true) {
                status = 'Game over, ' + moveColor + ' is in checkmate.';
            }
            // draw?
            else if (game.in_draw() === true) {
                status = 'Game over, drawn position';
            }
            // game still on
            else {
                status = moveColor + ' to move';
                // check?
                if (game.in_check() === true) {
                    status += ', ' + moveColor + ' is in check';
                }
            }
            statusEl.html(status);
            fenEl.html(game.fen());
            pgnEl.html(game.pgn());
        };
        var cfg = {
            draggable: true,
            position: 'start',
            sparePieces: true,
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
        board = ChessBoard('board1', cfg);
        updateStatus();
    };
    var gameRight = function () {
        var board, game = new Chess(), statusEl = $('#status2'), fenEl = $('#fen2'), pgnEl = $('#pgn2');

        var onDragStart = function (source, piece, position, orientation) {
            if (game.game_over() === true ||
                (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
        };
        var onDrop = function (source, target) {
            // see if the move is legal
            var move = game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });
            // illegal move
            if (move === null) return 'snapback';

            opponentAcrossTimer.toggle();
            teammateTimer.toggle();
            updateStatus();
        };
        var onSnapEnd = function () {
            board.position(game.fen());
        };
        var updateStatus = function () {
            var status = '';
            var moveColor = 'White';
            if (game.turn() === 'b') {
                moveColor = 'Black';
            }
            // checkmate?
            if (game.in_checkmate() === true) {
                status = 'Game over, ' + moveColor + ' is in checkmate.';
            }
            // draw?
            else if (game.in_draw() === true) {
                status = 'Game over, drawn position';
            }
            // game still on
            else {
                status = moveColor + ' to move';
                // check?
                if (game.in_check() === true) {
                    status += ', ' + moveColor + ' is in check';
                }
            }
            statusEl.html(status);
            fenEl.html(game.fen());
            pgnEl.html(game.pgn());
        };
        var cfg = {
            draggable: true,
            position: 'start',
            sparePieces: true,
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
        board = ChessBoard('board2', cfg);
        updateStatus();
    };

    $(document).ready(gameLeft);
    $(document).ready(gameRight);

    $scope.getInfoFormat = function (time_control) {
        var firstNum = parseInt(time_control.charAt(0));
        if (firstNum < 3) return "Bullet";
        else if (firstNum >= 3 && firstNum <= 7) return "Blitz";
        else return "Classical";
    };
    $scope.getDurationFormat = function (duration) {
        var minutes = Math.floor(duration / 60);
        var seconds = duration % 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return minutes + ":" + seconds;
    };
});