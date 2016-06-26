app.controller('logoutController', function ($timeout, $window, $location) {
    userID = null;
    $window.localStorage.removeItem("token");
    var $scope = $('[ng-controller=homeController]').scope();
    $scope.currentUser = null;
    $scope.gameArray = [];
    $scope.selectedGame = null;
    $timeout(function() { // will safely be run on the next digest cycle
        $scope.$apply();
    });
    $("#myNavbar").load("pages/navbar.html #originalNavbar");
    $location.path('/');
});