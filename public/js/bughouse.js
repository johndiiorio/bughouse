var app = angular.module('bughouse', ['ngRoute']);
var userID = null; //user ID of current user
var gameID = null; //game ID of current game

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        })
        .when('/loading', {
            templateUrl: 'pages/loading.html',
            controller: 'loadingController'
        })
        .when('/myprofile', {
            templateUrl: 'pages/myprofile.html',
            controller: 'myProfileController'
        })
        .when('/editprofile', {
            templateUrl: 'pages/editprofile.html',
            controller: 'editProfileController'
        })
        .when('/register', {
            templateUrl: 'pages/register.html',
            controller: 'registerController'
        })
        .when('/game', {
            templateUrl: 'pages/game.html',
            controller: 'gameController'
        })
        .when('/game/:game_id', {
            templateUrl: 'pages/gameViewer.html',
            controller: 'gameViewerController'
        })
        .when('/about', {
            templateUrl: 'pages/about.html',
            controller: 'aboutController'
        })
        .when('/logout', {
            templateUrl: 'pages/logout.html',
            controller: 'logoutController'
        })
        .otherwise({
            templateUrl: 'pages/error.html'
        });
    $locationProvider.html5Mode(true);
}]);

app.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}]);

//Helper function to check if value is in JSON
function checkForValue(json, value) {
    for (var key in json) {
        if (typeof (json[key]) === "object") {
            return checkForValue(json[key], value);
        } else if (json[key] === value) {
            return true;
        }
    }
    return false;
}