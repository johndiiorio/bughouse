app.controller('gameController', function ($scope, $http) {
    $scope.game = {};

    if (gameID) {
        $http({
            method: 'GET',
            url: '/api/games/' + gameID
        }).success(function (dataGame) {
            $scope.game = dataGame[0];
            for (var i = 1; i <= 4; i++) {
                (function (i) {
                    $http({
                        method: 'GET',
                        url: '/api/users/' + eval(String("dataGame[0].fk_player" + i + "_id"))
                    }).success(function (dataUser) {
                        eval("$scope.game.player" + i + "=dataUser[0]");
                    }).error(function () {
                        console.log("Error getting user");
                    });
                })(i);
            }
        }).error(function () {
            console.log("Error getting game");
        });
    } else {
        window.location = "/#/";
    }

    var yourTimer, yourOpponentTimer, opponentAcrossTimer, teammateTimer;

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

            //Update move history
            if (game.turn() === 'b') {
                moves.push(" " + leftCount + "A. " + game.history());
            } else {
                moves.push(" " + leftCount + "a. " + game.history());
                leftCount += 1;
            }

            //Update moves on server
            $http({
                method: 'PUT',
                url: '/api/games/update/moves/' + $scope.game.game_id,
                data: {moves: moves.join()}
            }).success(function () {
            }).error(function () {
                console.log("Error updating game moves");
            });

            //Update spare pieces
            var sparePiecesLeftArr = [];
            var putReserveData = [];
            if (game.turn() === 'b') {
                //var sparePiecesArr = [];
                for (var i = 0; i < game.reserve_white.length; i++) {
                    if (game.reserve_white[i].type == 'p') {
                        sparePiecesLeftArr.push('wP');
                    }
                    else if (game.reserve_white[i].type == 'n') {
                        sparePiecesLeftArr.push('wN');
                    }
                    else if (game.reserve_white[i].type == 'b'){
                        sparePiecesLeftArr.push('wB');
                    }
                    else if (game.reserve_white[i].type == 'r') {
                        sparePiecesLeftArr.push('wR');
                    }
                    else if (game.reserve_white[i].type == 'q') {
                        sparePiecesLeftArr.push('wQ');
                    }
                }
                board.updateSparePieces("white", sparePiecesLeftArr);

                //Update reserve on server
                for (var i = 0; i < game.reserve_white.length; i++) {
                    putReserveData[i] = JSON.stringify(game.reserve_white[i]);
                }
                $http({
                    method: 'PUT',
                    url: '/api/games/update/reserve/' + $scope.game.game_id,
                    data: {reserve: "left_reserve_white", pieces: putReserveData.toString()}
                }).success(function () {
                }).error(function () {
                    console.log("Error updating left game white pieces");
                });
            } else {
                for (var i = 0; i < game.reserve_black.length; i++) {
                    if (game.reserve_black[i].type == 'p') {
                        sparePiecesLeftArr.push('bP');
                    }
                    else if (game.reserve_black[i].type == 'n') {
                        sparePiecesLeftArr.push('bN');
                    }
                    else if (game.reserve_black[i].type == 'b') {
                        sparePiecesLeftArr.push('bB');
                    }
                    else if (game.reserve_black[i].type == 'r') {
                        sparePiecesLeftArr.push('bR');
                    }
                    else if (game.reserve_black[i].type == 'q') {
                        sparePiecesLeftArr.push('bQ');
                    }
                }
                board.updateSparePieces("black", sparePiecesLeftArr);

                //Update reserve on server
                for (var i = 0; i < game.reserve_black.length; i++) {
                    putReserveData[i] = JSON.stringify(game.reserve_black[i]);
                }
                $http({
                    method: 'PUT',
                    url: '/api/games/update/reserve/' + $scope.game.game_id,
                    data: {reserve: "left_reserve_black", pieces: putReserveData.toString()}
                }).success(function () {
                }).error(function () {
                    console.log("Error updating left game black pieces");
                });
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

            var sparePiecesRightArr = [];
            if (game.turn() === 'b') {
                for (var i = 0; i < game.reserve_white.length; i++) {
                    if (game.reserve_white[i].type == 'p') {
                        sparePiecesRightArr.push('wP');
                    }
                    else if (game.reserve_white[i].type == 'n') {
                        sparePiecesRightArr.push('wN');
                    }
                    else if (game.reserve_white[i].type == 'b'){
                        sparePiecesRightArr.push('wB');
                    }
                    else if (game.reserve_white[i].type == 'r') {
                        sparePiecesRightArr.push('wR');
                    }
                    else if (game.reserve_white[i].type == 'q') {
                        sparePiecesRightArr.push('wQ');
                    }
                }
                board.updateSparePieces("white", sparePiecesRightArr);
            } else {
                for (var i = 0; i < game.reserve_black.length; i++) {
                    if (game.reserve_black[i].type == 'p') {
                        sparePiecesRightArr.push('bP');
                    }
                    else if (game.reserve_black[i].type == 'n') {
                        sparePiecesRightArr.push('bN');
                    }
                    else if (game.reserve_black[i].type == 'b') {
                        sparePiecesRightArr.push('bB');
                    }
                    else if (game.reserve_black[i].type == 'r') {
                        sparePiecesRightArr.push('bR');
                    }
                    else if (game.reserve_black[i].type == 'q') {
                        sparePiecesRightArr.push('bQ');
                    }
                }
                board.updateSparePieces("black", sparePiecesRightArr);
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
            draggable: false,
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
    $scope.getRating = function (user, game) {
        if (user && game) {
            if (game.minutes < 3) return user.ratingBullet;
            else if (game.minutes >= 3 && game.minutes <= 8) return user.ratingBlitz;
            else return user.ratingClassical;
        }
    };

    //Update game every 10 ms
    window.setInterval(function(){
        //console.log(moves);
        if (gameID) {
            $http({
                method: 'GET',
                url: '/api/games/' + gameID
            }).success(function (data) {
                var dataMoves = data[0].moves;
                if (dataMoves) {
                    moves = dataMoves.split(",");
                }
            }).error(function () {
                console.log("Error starting game");
            });
        }
    }, 50);
});