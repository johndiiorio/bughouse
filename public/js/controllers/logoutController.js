app.controller('logoutController', function ($scope) {
    userID = null;
    authToken = null;
    $("#myNavbar").load("pages/navbar.html #originalNavbar");
    window.location = "/#/";
});