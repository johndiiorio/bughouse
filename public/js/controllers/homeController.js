app.controller('homeController', function ($scope, $http) {
    //Hide the login notifications
    $(document).ready(function () {
        $("#notificationSuccess").hide();
        $("#notificationError").hide();
    });
});