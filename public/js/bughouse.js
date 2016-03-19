var app = angular.module('bughouse', ['ngRoute']);
var authToken = null; //token return by database used for authentication
var userID = null; //user ID of current user
var userInitialized;

app.config(['$routeProvider', '$interpolateProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
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
        })
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

//Show notifications for 3 seconds
function showNotification(div) {
    $(div).delay("fast").fadeIn().delay(3000).fadeOut();
}
//Helper function to check if value is in JSON
//Used in the homeController when checking user roles
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