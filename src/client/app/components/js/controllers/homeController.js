app.controller('homeController', function ($scope, $http, $route, $window, $location) {
    var socket = io('/lobby');
    var socketLoading = io('/loading');

    $scope.selectedGame = null;
    $scope.gameArray = [];

    $(document).ready(function () {
        //Create the sliders and switches
        $('#minutesSlider').slider().on('slide', function (ev) {
            $('#minutesDisplay').text("Minutes: " + ev.value);
        });
        $('#incrementSlider').slider().on('slide', function (ev) {
            $('#incrementDisplay').text("Increment (seconds): " + ev.value);
        });
        $('#ratingSlider').slider().on('slide', function (ev) {
            $('#ratingDisplay').text("Rating range: " + ev.value[0] + " - " + ev.value[1]);
        });
        $('#randomSwitch').bootstrapSwitch({onColor: 'orange', size: 'mini', onText: 'Yes', offText: 'No'});
        $('#modeSwitch').bootstrapSwitch({onColor: 'orange', size: 'mini', onText: 'Yes', offText: 'No'});
    });

    $scope.formatRandom = function (game) {
        return game.join_random ? "Yes" : "No";
    };
    $scope.formatRange = function (game) {
        return game.rating_range.substring(0, game.rating_range.indexOf(',')) + " - " + game.rating_range.substring(game.rating_range.indexOf(',') + 1);
    };
    $scope.formatColor = function (player) {
        if (typeof player === 'undefined') {
            return "text-success";
        }
        if (player.length <= 0) {
            return "text-success";
        }
    };
    $scope.formatPlayer = function (player, game) {
        if (typeof player !== 'undefined') {
            if (typeof player[0] !== 'undefined') {
                var returnString = player[0].username;
                if (game.minutes < 3) {
                    returnString += " (" + player[0].ratingBullet + ")";
                } else if (game.minutes >= 3 && game.minutes <= 8) {
                    returnString += " (" + player[0].ratingBlitz + ")";
                } else {
                    returnString += " (" + player[0].ratingClassical + ")";
                }
                if (player[0].title !== null) {
                    returnString = player[0].title + " " + returnString;
                }
                return returnString;
            }
        }
        return "empty";
    };
    $scope.getSlots = function (game) {
        var count = 0;
        if (typeof game.player1 !== 'undefined' && game.player1.length > 0) count++;
        if (typeof game.player2 !== 'undefined' && game.player2.length > 0) count++;
        if (typeof game.player3 !== 'undefined' && game.player3.length > 0) count++;
        if (typeof game.player4 !== 'undefined' && game.player4.length > 0) count++;
        return count + "/4";
    };
    $scope.getGamesForUser = function () {
        $http({
            method: 'GET',
            url: '/api/games/open'
        }).success(function (data) {
            $scope.gameArray = [];
            for (var i = 0; i < data.length; i++) {
                var minRange = parseInt(data[i].rating_range.substring(0, data[i].rating_range.indexOf(',')));
                var maxRange = parseInt(data[i].rating_range.substring(data[i].rating_range.indexOf(',') + 1));
                var passBool = false;

                if ($scope.$parent) {
                    if (!$scope.$parent.currentUser) { // User not signed in
                        //Anonymous users can see all games
                        passBool = true;
                    } else { // check that the user can view
                        if (data[i].minutes < 3 && $scope.$parent.currentUser.ratingBullet >= minRange && $scope.$parent.currentUser.ratingBullet <= maxRange) {
                            passBool = true;
                        } else if (data[i].minutes >= 3 && data[i].minutes <= 8 && $scope.$parent.currentUser.ratingBlitz >= minRange && $scope.$parent.currentUser.ratingBlitz <= maxRange) {
                            passBool = true;
                        } else if (data[i].minutes > 8 && $scope.$parent.currentUser.ratingClassical >= minRange && $scope.$parent.currentUser.ratingClassical <= maxRange) {
                            passBool = true;
                        }
                    }
                }
                if (passBool) {
                    for (var j = 1; j <= 4; j++) {
                        (function (i) {
                            (function (j) {
                                // check if player not null
                                if(eval(String("data[i].fk_player" + j + "_id"))) {
                                    $http({
                                        method: 'GET',
                                        url: '/api/users/' + eval(String("data[i].fk_player" + j + "_id"))
                                    }).success(function (user, status, headers, config) {
                                        eval(String("data[i].player" + j + "=user"));
                                    }).error(function () {
                                        console.log("Error getting user");
                                    });
                                }
                            })(j);
                        })(i);
                    }
                    $scope.gameArray.push(data[i]);
                }
            }
        }).error(function () {
            console.log("Error getting open games");
        });
    };
    $scope.getOpenSlots = function (game) {
        var openSlots = [];
        if (typeof game.player1 === 'undefined' || game.player1.length <= 0) openSlots.push(1);
        if (typeof game.player2 === 'undefined' || game.player2.length <= 0) openSlots.push(2);
        if (typeof game.player3 === 'undefined' || game.player3.length <= 0) openSlots.push(3);
        if (typeof game.player4 === 'undefined' || game.player4.length <= 0) openSlots.push(4);
        return openSlots;
    };
    $scope.addPlayer = function (game) {
        if (!$scope.$parent.currentUser) {
            notif({
                msg: "<b>Error:</b> Please log in to join a game",
                type: "warning",
                position: "center",
                width: "all",
                timeout: 3000
            });
            return;
        }
        if (game.join_random) {
            var openSlots = $scope.getOpenSlots(game);
            var slot = openSlots[Math.floor(Math.random() * openSlots.length)];

            eval(String("game.player" + slot + "= $scope.$parent.currentUser"));

            var player1, player2, player3, player4;
            $http({
                method: 'GET',
                url: '/api/games/' + game.game_id
            }).success(function (data) {
                player1 = data[0].fk_player1_id;
                player2 = data[0].fk_player2_id;
                player3 = data[0].fk_player3_id;
                player4 = data[0].fk_player4_id;

                if (slot == 1) {
                    player1 = $scope.$parent.currentUser.user_id;
                } else if (slot == 2) {
                    player2 = $scope.$parent.currentUser.user_id;
                } else if (slot == 3) {
                    player3 = $scope.$parent.currentUser.user_id;
                } else {
                    player4 = $scope.$parent.currentUser.user_id;
                }

                var putData = {player1: player1, player2: player2, player3: player3, player4: player4};
                $http({
                    method: 'PUT',
                    url: '/api/games/open/' + game.game_id,
                    data: putData
                }).success(function () {
                    $scope.switchToLoadingScreen(game.game_id);
                    if ($scope.getOpenSlots(game).length == 0) {
                        $scope.startGame(game);
                    }
                }).error(function () {
                    console.log("Error updating game");
                });
            }).error(function () {
                console.log("Error getting game");
            });
        } else {
            $('#gameModal').modal('show');
            $scope.selectedGame = game;

            $http({
                method: 'GET',
                url: '/api/games/' + game.game_id
            }).success(function (data) {
                player1 = data[0].fk_player1_id;
                player2 = data[0].fk_player2_id;
                player3 = data[0].fk_player3_id;
                player4 = data[0].fk_player4_id;

                if (player1 != null) $("#joinPlayer1").hide();
                if (player2 != null) $("#joinPlayer2").hide();
                if (player3 != null) $("#joinPlayer3").hide();
                if (player4 != null) $("#joinPlayer4").hide();

            }).error(function (data, status, headers, config) {
                console.log("Error getting game");
            });
        }
    };
    $scope.joinPlayer = function ($event) {
        $('#gameModal').removeClass('fade');
        $('#gameModal').modal('hide');
        var slot = $event.target.id.substring($event.target.id.length - 1);
        var player1, player2, player3, player4;

        player1 = $scope.selectedGame.fk_player1_id;
        player2 = $scope.selectedGame.fk_player2_id;
        player3 = $scope.selectedGame.fk_player3_id;
        player4 = $scope.selectedGame.fk_player4_id;

        if (slot == 1) {
            player1 = $scope.$parent.currentUser.user_id;
        } else if (slot == 2) {
            player2 = $scope.$parent.currentUser.user_id;
        } else if (slot == 3) {
            player3 = $scope.$parent.currentUser.user_id;
        } else {
            player4 = $scope.$parent.currentUser.user_id;
        }

        var putData = {player1: player1, player2: player2, player3: player3, player4: player4};
        $http({
            method: 'PUT',
            url: '/api/games/open/' + $scope.selectedGame.game_id,
            data: putData
        }).success(function () {
            $scope.switchToLoadingScreen($scope.selectedGame.game_id);
            if ($scope.getOpenSlots($scope.selectedGame).length <= 1) {
                $scope.startGame($scope.selectedGame);
            }
        }).error(function () {
            console.log("Error updating game");
        });
    };
    $scope.createGame = function (side) {

    };
    $scope.startGame = function (game) {
        $http({
            method: 'PUT',
            url: '/api/games/start/' + game.game_id
        }).success(function () {
            socketLoading.emit("begin game");
            $scope.switchToLoadingScreen(game.game_id);
        }).error(function () {
            console.log("Error starting game");
        });
    };
    $scope.switchToLoadingScreen = function(id) {
        socket.emit('update game list');
        gameID = id;
        $location.path('/loading');
    };
    $scope.userLogIn = function () {
        var user = {username: $scope.login.username, password: $scope.login.password};
        $http({
            method: 'POST',
            url: '/api/login',
            data: user
        }).success(function (data) {
            $scope.$parent.currentUser = data.user;
            $window.localStorage.setItem("token", data.token);
            userID = data.user.user_id;
            $("#myNavbar").load("pages/navbar.html #loadNavbar", function () {
                var title = "";
                if ($scope.$parent.currentUser.title != null) title = $scope.$parent.currentUser.title + " ";
                $("#profileName").text(title + $scope.$parent.currentUser.username + " (" + $scope.$parent.currentUser.ratingBullet + ", " + $scope.$parent.currentUser.ratingBlitz + ", " + $scope.$parent.currentUser.ratingClassical + ")");
                $('[data-toggle="tooltip"]').tooltip();
            });
        }).error(function () {
            $("#loginPassword").val('');
            notif({
                msg: "<b>Error:</b> Invalid username/password combination",
                type: "error",
                position: "center",
                width: "all",
                timeout: 2000
            });
        });
    };

    //Execute once on page load
    $scope.getGamesForUser();

    socket.on('update game list', function() {
        $scope.getGamesForUser();
    });
});
