app.controller('homeController', function ($scope, $http) {
    $scope.gameArray = [];

    //Tests
    $scope.game = {};
    $scope.game.time_control = "5+8";
    $scope.game.mode = "Casual";
    $scope.game.join_random = true;
    $scope.game.player1 = {username: "Xivister", rating: 1623};
    $scope.game.player2 = null;
    $scope.game.player3 = {username: "superGM", rating: 2753};
    $scope.game.player4 = null;
    $scope.gameArray.push($scope.game);

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
        $('#randomSlider').bootstrapSwitch();
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
            if (slot == 1) {
                game.player1 = currentUser;
            }
            else if (slot == 2) {
                game.player2 = currentUser;
            }
            else if (slot == 3) {
                game.player3 = currentUser;
            }
            else if (slot == 4) {
                game.player4 = currentUser;
            }
            if($scope.getOpenSlots(game).length == 0) {
                $scope.startGame(game);
            }
        } else {
            alert("Joining when join_random is false is not implemented");
        }
    };
    $scope.startGame = function(game) {
        window.location = "/#/game";
    }
});