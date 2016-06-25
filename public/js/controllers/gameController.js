app.controller('gameController', function ($scope, $http, $window, $location) {
    var socket = io('/game');
    socket.on('connect', function() {
        socket.emit('room', gameID);
    });

    $scope.game = {};
    $scope.display = {};
    var fkNum;
    if (gameID) {
        $http({
            method: 'GET',
            url: '/api/games/' + gameID
        }).success(function (dataGame) {
            $scope.game = dataGame[0];
            for (var i = 1; i <= 4; i++) {
                (function (i) {
                    // Get the info of each user
                    $http({
                    method: 'GET',
                    url: '/api/users/' + eval(String("dataGame[0].fk_player" + i + "_id"))
                    }).success(function (dataUser) {
                        // $scope.game.player is the internal database representation of the user
                        eval("$scope.game.player" + i + "=dataUser[0]");
                        // Populate $scope.display.player"i" with players on last loop
                        if (i == 4) {
                            updateDisplayUsers();
                        }
                    }).error(function () {
                        console.log("Error getting user");
                    });
                })(i);
            }
        }).error(function () {
            console.log("Error getting game");
        });
    } else { // there is no game in progress
        $location.path('/');
    }

    var yourTimer, yourOpponentTimer, opponentAcrossTimer, teammateTimer;

    var yourDisplay = $('#yourTime'),
        yourOpponentDisplay = $('#yourOpponentTime'),
        opponentAcrossDisplay = $('#opponentAcrossTime'),
        teammateAcrossDisplay = $('#teammateTime');

    var moves = [];
    var leftCount = 1;
    var rightCount = 1;
    var board1;
    var board2;

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
        var boardEl = $('#board1'), game = new Chess(), squareToHighlight;

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

            // Update moves via socket
            var updateMovesData = {game_id: $scope.game.game_id, moves: moves.join()};
            socket.emit('update moves', updateMovesData);

            //Update spare pieces
            var sparePiecesLeftArr = [];
            var putReserveData = [];
            if (game.turn() === 'b') {
                //var sparePiecesArr = [];
                for (var i = 0; i < game.reserve_white.length; i++) {
                    if (game.reserve_white[i].type == 'p') {
                        sparePiecesLeftArr.push('bP');
                    }
                    else if (game.reserve_white[i].type == 'n') {
                        sparePiecesLeftArr.push('bN');
                    }
                    else if (game.reserve_white[i].type == 'b'){
                        sparePiecesLeftArr.push('bB');
                    }
                    else if (game.reserve_white[i].type == 'r') {
                        sparePiecesLeftArr.push('bR');
                    }
                    else if (game.reserve_white[i].type == 'q') {
                        sparePiecesLeftArr.push('bQ');
                    }
                }
                board2.updateSparePieces("black", sparePiecesLeftArr);
                for (var i = 0; i < game.reserve_white.length; i++) {
                    putReserveData[i] = JSON.stringify(game.reserve_white[i]);
                }
            } else {
                for (var i = 0; i < game.reserve_black.length; i++) {
                    if (game.reserve_black[i].type == 'p') {
                        sparePiecesLeftArr.push('wP');
                    }
                    else if (game.reserve_black[i].type == 'n') {
                        sparePiecesLeftArr.push('wN');
                    }
                    else if (game.reserve_black[i].type == 'b') {
                        sparePiecesLeftArr.push('wB');
                    }
                    else if (game.reserve_black[i].type == 'r') {
                        sparePiecesLeftArr.push('wR');
                    }
                    else if (game.reserve_black[i].type == 'q') {
                        sparePiecesLeftArr.push('wQ');
                    }
                }
                board2.updateSparePieces("white", sparePiecesLeftArr);

                for (var i = 0; i < game.reserve_black.length; i++) {
                    putReserveData[i] = JSON.stringify(game.reserve_black[i]);
                }
            }

            var reserveLocation = "right_reserve_black";
            if (fkNum == 2) { reserveLocation = "right_reserve_white"; }
            else if(fkNum == 3) { reserveLocation = "left_reserve_black";}
            else if (fkNum == 4) { reserveLocation = "left_reserve_white";}
            var updateReserveData = {game_id: $scope.game.game_id, pieces: putReserveData.toString(), reserve: reserveLocation};
            socket.emit('update reserve', updateReserveData);

            if(game.turn() === 'w') {
                removeHighlights('white');
                boardEl.find('.square-' + source).addClass('highlight-black');
                boardEl.find('.square-' + target).addClass('highlight-black');
            } else {
                removeHighlights('black');
                boardEl.find('.square-' + source).addClass('highlight-white');
                boardEl.find('.square-' + target).addClass('highlight-white');
            }

            yourOpponentTimer.toggle();
            yourTimer.toggle();
            updateStatus();
        };
        var onSnapEnd = function () {
            board1.position(game.fen());
        };
        var updateStatus = function () {
            $('#pgn').html(moves);
        };
        var removeHighlights = function(color) {
            boardEl.find('.square-55d63').removeClass('highlight-' + color);
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
        board1 = ChessBoard('board1', cfg);
        updateStatus();
    };
    var gameRight = function () {
        var boardEl = $('#board2'), game = new Chess(), squareToHighlight;
        var onSnapEnd = function () {
            board2.position(game.fen());
        };
        var updateStatus = function () {
            if(game.turn() === 'w') {
                removeHighlights('white');
                boardEl.find('.square-' + source).addClass('highlight-black');
                boardEl.find('.square-' + target).addClass('highlight-black');
            } else {
                removeHighlights('black');
                boardEl.find('.square-' + source).addClass('highlight-white');
                boardEl.find('.square-' + target).addClass('highlight-white');
            }
            opponentAcrossTimer.toggle();
            teammateTimer.toggle();
            $('#pgn').html(moves);
        };
        var removeHighlights = function(color) {
            boardEl.find('.square-55d63').removeClass('highlight-' + color);
        };
        var cfg = {
            draggable: false,
            position: 'start',
            sparePieces: true,
            showNotation: false,
            onSnapEnd: onSnapEnd
        };
        board2 = ChessBoard('board2', cfg);
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

    // TODO: Update moves via socket
    socket.on('update moves', function(data) {
        console.log('Incoming message: ' + data);
        //var dataMoves = data[0].moves;
        //if (dataMoves) {
        //    dataMoves = dataMoves.split(",");
        //    console.log(moves);
        //    console.log(dataMoves);
        //    if (!arraysEqual(dataMoves, moves)) {
        //        moves = dataMoves;
        //    }
        //}
    });

    // TODO: Update reserve via socket
    socket.on('update reserve', function(data) {
        console.log('Incoming message: ' + data);
        //board1/2.updateSparePieces("white"/"black", data.pieces);
    });

    function arraysEqual(arr1, arr2) {
        if(arr1.length !== arr2.length)
            return false;
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }
    function getForeignKeyNumber() {
        for(var i = 1; i <= 4; i++) {
            if (eval(String("$scope.game.fk_player" + i + "_id")) == $scope.currentUser.user_id) {
                return i;
            }
        }
    }
    function updateDisplayUsers() {
        // $scope.display.player"i" is graphical representation of the user for display the boards
        //  2   3
        //  1   4
        fkNum = getForeignKeyNumber();
        if(fkNum == 1) {
            $scope.display.player1 = $scope.game.player1;
            $scope.display.player2 = $scope.game.player2;
            $scope.display.player3 = $scope.game.player3;
            $scope.display.player4 = $scope.game.player4;
            board2.flip();
        } else if (fkNum == 2){
            $scope.display.player1 = $scope.game.player2;
            $scope.display.player2 = $scope.game.player1;
            $scope.display.player3 = $scope.game.player4;
            $scope.display.player4 = $scope.game.player3;
            board1.flip();
        } else if (fkNum == 3){
            $scope.display.player1 = $scope.game.player3;
            $scope.display.player2 = $scope.game.player4;
            $scope.display.player3 = $scope.game.player1;
            $scope.display.player4 = $scope.game.player2;
            board2.flip();
        } else if (fkNum == 4){
            $scope.display.player1 = $scope.game.player4;
            $scope.display.player2 = $scope.game.player3;
            $scope.display.player3 = $scope.game.player2;
            $scope.display.player4 = $scope.game.player1;
            board1.flip();
        }
    }
});