app.controller('myProfileController', function ($scope, $location) {
    if (!$scope.currentUser.username) $location.path('/');
});