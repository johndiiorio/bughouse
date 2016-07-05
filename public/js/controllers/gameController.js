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
    var moveCount = 1;
    var board1;
    var board2;
    var game1 = new Chess();
    var game2 = new Chess();
    var boardEl1 = $('#board1');
    var boardEl2 = $('#board2');
    var tmpPromotionPiece = null;
    var tmpSourceSquare = null;
    var tmpTargetSquare = null;

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
        var onDragStart = function (source, piece, position, orientation) {
            if (game1.game_over() === true ||
                (game1.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game1.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
        };
        var onDrop = function (source, target, piece) {
            // check if move is a pawn promotion
            if (source != "spare" && piece.charAt(1).toLowerCase() == 'p' && (target.charAt(1) == 1 || target.charAt(1) == 8)) {
                function getTargetColumn(letter) {
                    if (letter == 'a') return 1;
                    else if (letter == 'b') return 2;
                    else if (letter == 'c') return 3;
                    else if (letter == 'd') return 4;
                    else if (letter == 'e') return 5;
                    else if (letter == 'f') return 6;
                    else if (letter == 'g') return 7;
                    else return 8;
                }
                // Check if promotion is allowed here
                var move = game1.move({
                    from: source,
                    to: target,
                    promotion: "q"
                });
                game1.undo();
                if (move != null) { // promotion is allowed, display popup to select piece
                    var targetColumn = getTargetColumn(target.charAt(0));
                    if (piece.charAt(0) == 'w') {
                        $("#white_promotion").css({"display": "block"});
                        $('#white_promotion').css('transform', 'translate(' + (targetColumn * 62 - 60) + 'px, 64px)');
                    }
                    else {
                        targetColumn = 9 - targetColumn;
                        $("#black_promotion").css({"display": "block"});
                        $('#black_promotion').css('transform', 'translate(' + (targetColumn * 62 - 60) + 'px, 64px)');
                    }
                    tmpSourceSquare = source;
                    tmpTargetSquare = target;
                    deletePieceFromSquare(tmpSourceSquare);
                }
                return 'snapback'; // remove the pawn being promoted or snapback the invalid piece move
            }
            // not a promotion, handle move normally
            else {
                handleMove(source, target, piece);
            }
        };
        var handleMove = function (source, target, piece) {
            // see if the move is legal
            var move;
            if (source == "spare") {
                move = game1.move(piece.charAt(1) + "@" + target);
            } else {
                move = game1.move({
                    from: source,
                    to: target,
                    promotion: tmpPromotionPiece
                });
            }
            // illegal move
            if (move === null) return 'snapback';

            //Update move history
            if (fkNum == 1) {
                moves.push(moveCount + "A. " + game1.history());
            } else if (fkNum == 2) {
                moves.push(moveCount + "a. " + game1.history());
            } else if (fkNum == 3) {
                moves.push(moveCount + "B. " + game1.history());
            } else {
                moves.push(moveCount + "b. " + game1.history());
            }

            // Update moves via socket
            var updateMovesData = {game_id: $scope.game.game_id, moves: moves.join()};
            socket.emit('update moves', updateMovesData);

            //Update spare pieces
            var sparePiecesLeftArr = [];
            var putReserveData = [];
            if (game1.turn() === 'b') {
                //var sparePiecesArr = [];
                for (var i = 0; i < game1.reserve_white.length; i++) {
                    if (game1.reserve_white[i].type == 'p') {
                        sparePiecesLeftArr.push('bP');
                    }
                    else if (game1.reserve_white[i].type == 'n') {
                        sparePiecesLeftArr.push('bN');
                    }
                    else if (game1.reserve_white[i].type == 'b'){
                        sparePiecesLeftArr.push('bB');
                    }
                    else if (game1.reserve_white[i].type == 'r') {
                        sparePiecesLeftArr.push('bR');
                    }
                    else if (game1.reserve_white[i].type == 'q') {
                        sparePiecesLeftArr.push('bQ');
                    }
                }
                board2.updateSparePieces("black", sparePiecesLeftArr);
                for (var i = 0; i < game1.reserve_white.length; i++) {
                    putReserveData[i] = JSON.stringify(game1.reserve_white[i]);
                }
            } else {
                for (var i = 0; i < game1.reserve_black.length; i++) {
                    if (game1.reserve_black[i].type == 'p') {
                        sparePiecesLeftArr.push('wP');
                    }
                    else if (game1.reserve_black[i].type == 'n') {
                        sparePiecesLeftArr.push('wN');
                    }
                    else if (game1.reserve_black[i].type == 'b') {
                        sparePiecesLeftArr.push('wB');
                    }
                    else if (game1.reserve_black[i].type == 'r') {
                        sparePiecesLeftArr.push('wR');
                    }
                    else if (game1.reserve_black[i].type == 'q') {
                        sparePiecesLeftArr.push('wQ');
                    }
                }
                board2.updateSparePieces("white", sparePiecesLeftArr);

                for (var i = 0; i < game1.reserve_black.length; i++) {
                    putReserveData[i] = JSON.stringify(game1.reserve_black[i]);
                }
            }

            var reserveLocation = "right_reserve_black";
            if (fkNum == 2) { reserveLocation = "right_reserve_white"; }
            else if(fkNum == 3) { reserveLocation = "left_reserve_black";}
            else if (fkNum == 4) { reserveLocation = "left_reserve_white";}
            var updateReserveData = {game_id: $scope.game.game_id, pieces: putReserveData.toString(), reserve: reserveLocation};
            socket.emit('update reserve', updateReserveData);

            if(game1.turn() === 'w') {
                $scope.removeHighlights(boardEl1, 'white');
                boardEl1.find('.square-' + source).addClass('highlight-black');
                boardEl1.find('.square-' + target).addClass('highlight-black');
            } else {
                $scope.removeHighlights(boardEl1, 'black');
                boardEl1.find('.square-' + source).addClass('highlight-white');
                boardEl1.find('.square-' + target).addClass('highlight-white');
            }

            yourOpponentTimer.toggle();
            yourTimer.toggle();
            updateStatus();
        };
        $scope.selectPromotionPiece = function (piece) {
            tmpPromotionPiece = piece.charAt(1).toLowerCase();
            addPieceToSquare(tmpTargetSquare, piece);
            $("#white_promotion").css({"display": "none"});
            $("#black_promotion").css({"display": "none"});
            handleMove(tmpSourceSquare, tmpTargetSquare, piece);
        }
        var addPieceToSquare = function(square, piece) {
            var newPosition = board1.position();
            newPosition[square] = piece;
            board1.position(newPosition);
        };
        var deletePieceFromSquare = function(square) {
            var newPosition = board1.position();
            delete newPosition[square];
            board1.position(newPosition);
        };
        var onSnapEnd = function() {
            board1.position(game1.fen());
        };
        var updateStatus = function() {
            $('#pgn').html(moves);
        };
        var cfg = {
            draggable: true,
            position: 'start',
            sparePieces: true,
            showNotation: false,
            snapbackSpeed: 0,
            snapSpeed: 0,
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
        board1 = ChessBoard('board1', cfg);
        updateStatus();
    };
    var gameRight = function () {
        var onSnapEnd = function () {
            board2.position(game2.fen());
        };
        var updateStatus = function () {
            if(game2.turn() === 'w') {
                $scope.removeHighlights(boardEl2, 'white');
                boardEl2.find('.square-' + source).addClass('highlight-black');
                boardEl2.find('.square-' + target).addClass('highlight-black');
            } else {
                $scope.removeHighlights(boardEl2, 'black');
                boardEl2.find('.square-' + source).addClass('highlight-white');
                boardEl2.find('.square-' + target).addClass('highlight-white');
            }
            opponentAcrossTimer.toggle();
            teammateTimer.toggle();
            $('#pgn').html(moves);
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
    $scope.removeHighlights = function(boardEl, color) {
        boardEl.find('.square-55d63').removeClass('highlight-' + color);
    };

    socket.on('update moves', function(data) {
        console.log('Incoming message moves: ' + data);
        var arrMoves = data.split(",");
        var diffMoves = $(arrMoves).not(moves).get();

        for (var i = 0; i < diffMoves.length; i++) {
            var moveStr = diffMoves[i].substring(diffMoves[i].indexOf(" ") + 1);
            var boardLetter = diffMoves[i].charAt(diffMoves[i].indexOf(" ") - 2);
            // 2    3
            // 1    4
            var boardNum = 1;
            if (boardLetter == boardLetter.toLowerCase() && boardLetter.toUpperCase() == 'A') boardNum = 2;
            else if (boardLetter == boardLetter.toUpperCase() && boardLetter.toUpperCase() == 'B') boardNum = 3;
            else if (boardLetter == boardLetter.toLowerCase() && boardLetter.toUpperCase() == 'B') boardNum = 4;
            var promotionPiece = 'q';
            if (moveStr.indexOf("=") != -1) {
                promotionPiece = moveStr.charAt(moveStr.indexOf("=") + 1);
            }

            function updateState(boardSideToUpdate) {
                if (boardSideToUpdate == 1) {
                    var sourceDestObj1 = game1.getSourceDestinationSquares(moveStr);
                    // Update UI
                    board1.move(sourceDestObj1.source + "-" + sourceDestObj1.destination);
                    //Update internal game state
                    if (!sourceDestObj1.source) {
                        game1.move(moveStr.charAt(1) + "@" + sourceDestObj1.destination);
                    } else {
                        game1.move({
                            from: sourceDestObj1.source,
                            to: sourceDestObj1.destination,
                            promotion: promotionPiece
                        });
                    }
                } else {
                    var sourceDestObj2 = game2.getSourceDestinationSquares(moveStr);
                    // Update UI
                    board2.move(sourceDestObj2.source + "-" + sourceDestObj2.destination);
                    //Update internal game state
                    if (!sourceDestObj2.source) {
                        game2.move(moveStr.charAt(1) + "@" + sourceDestObj2.destination);
                    } else {
                        game2.move({
                            from: sourceDestObj2.source,
                            to: sourceDestObj2.destination,
                            promotion: promotionPiece
                        });
                    }
                }
            }
            if (fkNum == 1 || fkNum == 2) {
                if (boardNum == 1 || boardNum == 2) {
                    updateState(1);
                } else {
                    updateState(2);
                }
            } else {
                if (boardNum == 1 || boardNum == 2) {
                    updateState(2);
                } else {
                    updateState(1);
                }
            }
        }
        moves = arrMoves;
    });

    // TODO: Update reserve via socket
    socket.on('update reserve', function(data) {
        console.log('Incoming message reserve: ' + data);
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