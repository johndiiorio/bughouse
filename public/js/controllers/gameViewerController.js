app.controller('gameViewerController', function ($scope, $http, $routeParams) {
    var game_id = $routeParams.game_id;

    $http({
        method: 'GET',
        url: '/api/games/' + game_id
    }).success(function (dataGame) {
        if(dataGame.length > 0) {
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
                        }
                    }).error(function () {
                        console.log("Error getting user");
                    });
                })(i);
            }
        }
        else {
            // Game user requesting does not exist
            window.location = "/";
        }
    }).error(function () {
        console.log("Error getting game");
    });
});