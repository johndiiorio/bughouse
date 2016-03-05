app.controller('homeController', function ($scope, $http) {
    //TODO get userID, rating
    $scope.currentUser = {user_id: 1, username: "Anonymous", rating: 1800};

    $scope.gameArray = [];

    $(document).ready(function () {
        //Hide the login notifications
        $("#notificationSuccess").hide();
        $("#notificationError").hide();

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

    $scope.formatRandom = function(game) {
        return game.join_random ? "Yes" : "No";
    };
    $scope.formatRange = function(game) {
        return game.rating_range.substring(0, game.rating_range.indexOf(',')) + " - " + game.rating_range.substring(game.rating_range.indexOf(',') + 1);
    };
    $scope.getSlots = function (game) {
        var count = 0;
        if(game.player1 != null) count++;
        if(game.player2 != null) count++;
        if(game.player3 != null) count++;
        if(game.player4 != null) count++;
        return count + "/4";
    };
    $scope.getGamesForUser = function() {
        $http({
            method: 'GET',
            url: '/api/games/open'
        }).success(function (data, status, headers, config) {
            $scope.gameArray = [];
            for (var i = 0; i < data.length; i++) {
                var minRange = parseInt(data[i].rating_range.substring(0, data[i].rating_range.indexOf(',')));
                var maxRange = parseInt(data[i].rating_range.substring(data[i].rating_range.indexOf(',') + 1));
                if ($scope.currentUser.rating >= minRange && $scope.currentUser.rating <= maxRange) {
                    $scope.gameArray.push(data[i]);
                }
            }
        }).error(function (data, status, headers, config) {
            console.log("Error getting open games");
        });
    };
    $scope.formatColor = function(player) {
        if (player == null) {
            return "text-success";
        }
    };
    $scope.formatPlayer = function(player) {
        if(player != null) {
            return player.username + " (" + player.rating + ")";
        } else {
            return "empty";
        }
    };
    $scope.getOpenSlots = function(game) {
        var openSlots = [];
        if(game.player1 == null) openSlots.push(1);
        if(game.player2 == null) openSlots.push(2);
        if(game.player3 == null) openSlots.push(3);
        if(game.player4 == null) openSlots.push(4);
        return openSlots;
    };
    $scope.addPlayer = function(game) {
        if (game.join_random) {
            var openSlots = $scope.getOpenSlots(game);
            var slot = openSlots[Math.floor(Math.random() * openSlots.length)];

            eval(String("game.player" + slot+"= $scope.currentUser"));

            var player1, player2, player3, player4;
            $http({
                method: 'GET',
                url: '/api/games/open/' + game.game_id
            }).success(function (data, status, headers, config) {
                player1 = data.fk_player1_id;
                player2 = data.fk_player2_id;
                player3 = data.fk_player3_id;
                player4 = data.fk_player4_id;

                if(slot == 1) {
                    player1 = $scope.currentUser.user_id;
                } else if(slot == 2) {
                    player2 = $scope.currentUser.user_id;
                } else if(slot == 3) {
                    player3 = $scope.currentUser.user_id;
                } else {
                    player4 = $scope.currentUser.user_id;
                }

                var putData = {player1: player1, player2: player2, player3: player3, player4: player4};
                console.log(putData);

                $http({
                    method: 'PUT',
                    url: '/api/games/open/' + game.game_id,
                    data: putData
                }).success(function (data, status, headers, config) {
                }).error(function (data, status, headers, config) {
                    console.log("Error creating game");
                });
            }).error(function (data, status, headers, config) {
                console.log("Error creating game");
            });

            if($scope.getOpenSlots(game).length == 0) {
                $scope.startGame(game);
            }
        } else {
            alert("Joining when join_random is false is not implemented");
        }
    };
    $scope.createGame = function(side) {
        var postData = {};
        postData.minutes = $('#minutesSlider').val() ? $('#minutesSlider').val() : 5;
        postData.increment = $('#incrementSlider').val() ? $('#incrementSlider').val() : 5;
        postData.rating_range = $('#ratingSlider').val() ? $('#ratingSlider').val() : "500,2500";
        postData.join_random = $('#randomSwitch').bootstrapSwitch('state') == true ? 1 : 0;
        postData.mode = $('#modeSwitch').bootstrapSwitch('state') == true ? "Rated" : "Casual";
        postData.status = "open";
        if (side == 'random') {
            Math.floor(Math.random() * 2) == 0 ? side = 'white' : side = 'black';
        }
        if (side == 'white') {
            postData.player1 = $scope.currentUser.user_id;
            postData.player2 = null;
            postData.player3 = null;
            postData.player4 = null;
        } else {
            postData.player1 = null;
            postData.player2 = $scope.currentUser.user_id;
            postData.player3 = null;
            postData.player4 = null;
        }
        $http({
            method: 'POST',
            url: '/api/games',
            data: postData
        }).success(function (data, status, headers, config) {
            $scope.getGamesForUser();
        }).error(function (data, status, headers, config) {
            console.log("Error creating game");
        });
    };
    $scope.startGame = function(game) {
        $http({
            method: 'PUT',
            url: '/api/games/start/' + game.game_id
        }).success(function (data, status, headers, config) {
        }).error(function (data, status, headers, config) {
            console.log("Error creating game");
        });
        window.location = "/#/game";
    };

    //Done after function has been initialized
    $scope.getGamesForUser();
});