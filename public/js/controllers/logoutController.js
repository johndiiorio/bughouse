app.controller('logoutController', function ($scope) {
    //TODO clear all variables
    userID = null;
    authToken = null;
    window.location = "/#/";
});