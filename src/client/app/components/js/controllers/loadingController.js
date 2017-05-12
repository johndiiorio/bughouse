app.controller('loadingController', function ($scope, $http, $location) {
    if (!gameID) {
        $location.path('/');
    }

    var socket = io('/loading');
    socket.on('connect', function() {
        socket.emit('room', gameID);
    });

    socket.on('begin game', function() {
        $location.path('/game');
    });
});