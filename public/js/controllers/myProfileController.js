app.controller('myProfileController', function ($scope) {
    if ($scope.currentUser.username === "Anonymous") window.location = "/#/";
});