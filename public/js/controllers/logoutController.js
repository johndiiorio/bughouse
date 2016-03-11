app.controller('logoutController', function ($scope) {
    userID = null;
    authToken = null;
    $scope.currentUser = {user_id: 1, username: "Anonymous", ratingBullet: 1500, ratingBlitz: 1500, ratingClassical: 1500};
    $scope.selectedGame = null;
    $("#myNavbar").load("pages/navbar.html #originalNavbar");
    window.location = "/#/";
});