app.controller('logoutController', function ($timeout, $window) {
    userID = null;
    $window.localStorage.removeItem("token");
    var $scope = $('[ng-controller=homeController]').scope();
    $scope.currentUser = {user_id: 1, username: "Anonymous", ratingBullet: 1500, ratingBlitz: 1500, ratingClassical: 1500};
    $scope.gameArray = [];
    $scope.selectedGame = null;
    $scope.userInitialized = false;
    $timeout(function() { // will safely be run on the next digest cycle
        $scope.$apply();
    });
    $("#myNavbar").load("pages/navbar.html #originalNavbar");
    window.location = "/#/";
});