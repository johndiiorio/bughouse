app.controller('homeController', function ($scope, $http) {
    //TODO get userID
    var userID = 1;
    $scope.gameArray = [];

    $http({
        method: 'GET',
        url: '/api/games/open'
    }).success(function (data, status, headers, config) {
        for (var i = 0; i < data.length; i++) {
            $scope.gameArray.push(data[i]);
        }
    }).error(function (data, status, headers, config) {
        console.log("Error getting open games");
    });


    $(document).ready(function () {
        //Hide the login notifications
        $("#notificationSuccess").hide();
        $("#notificationError").hide();

        $('#minutesSlider').slider().on('slide', function (ev) {
            $('#minutesDisplay').text("Minutes: " + ev.value);
        });
        $('#incrementSlider').slider().on('slide', function (ev) {
            $('#incrementDisplay').text("Increment (seconds): " + ev.value);
        });
        $('#ratingSlider').slider().on('slide', function (ev) {
            $('#ratingDisplay').text("Rating range: " + ev.value[0] + " - " + ev.value[1]);
        });
        $('#randomSwitch').bootstrapSwitch();
        $('#modeSwitch').bootstrapSwitch();

    });

    $scope.formatRandom = function(game) {
        return game.join_random ? "Yes" : "No";
    };

    $scope.getSlots = function (game) {
        var count = 0;
        if(game.player1 != null) count++;
        if(game.player2 != null) count++;
        if(game.player3 != null) count++;
        if(game.player4 != null) count++;
        return count + "/4";
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
            //TODO CHANGE THIS
            var currentUser = {username: "Anonymous", rating: 1200};
            eval(String("game.player" + slot+"= currentUser"));
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
        postData.mode = $('#randomSwitch').bootstrapSwitch('state') == true ? "Casual" : "Rated";
        postData.status = "open";
        if (side == 'random') {
            Math.floor(Math.random() * 2) == 0 ? side = 'white' : side = 'black';
        }
        if (side == 'white') {
            postData.player1 = userID;
            postData.player2 = null;
            postData.player3 = null;
            postData.player4 = null;
        } else {
            postData.player1 = null;
            postData.player2 = userID;
            postData.player3 = null;
            postData.player4 = null;
        }
        $http({
            method: 'POST',
            url: '/api/games',
            data: postData
        }).success(function (data, status, headers, config) {
            $http({
                method: 'GET',
                url: '/api/games/open'
            }).success(function (data, status, headers, config) {
                $scope.gameArray = [];
                for (var i = 0; i < data.length; i++) {
                    $scope.gameArray.push(data[i]);
                }
            }).error(function (data, status, headers, config) {
                console.log("Error getting open games");
            });
        }).error(function (data, status, headers, config) {
            console.log("Error creating game");
        });
    };
    $scope.startGame = function(game) {
        var putData = {};
        //TODO implement putting games
        //$http({
        //    method: 'PUT',
        //    url: '/api/games',
        //    data: putData
        //}).success(function (data, status, headers, config) {
        //}).error(function (data, status, headers, config) {
        //    console.log("Error creating game");
        //});
        window.location = "/#/game";
    }
});