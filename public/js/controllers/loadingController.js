app.controller('loadingController', function ($scope, $http) {
    if (!gameID) {
        window.location = "/#/" ;
    }

    var socket = io('/loading');
    socket.on('connect', function() {
        socket.emit('room', gameID);
    });

    socket.on('begin game', function() {
        window.location = "/#/game";
    });
});