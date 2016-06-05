app.controller('loadingController', function ($scope, $http) {
    if (!gameID) {
        window.location = "/#/" ;
    }

    //Check if game has started
    var checkIfGamePlaying = window.setInterval(function() {
        $http({
            method: 'GET',
            url: '/api/games/' + gameID
        }).success(function (data) {
            if (data[0].status === "playing") {
                clearInterval(checkIfGamePlaying);
                window.location = "/#/game";
            }
        }).error(function () {
            console.log("Error getting game from loading page");
        });
    }, 500);
});