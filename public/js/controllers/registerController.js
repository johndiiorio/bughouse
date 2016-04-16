app.controller('registerController', function ($scope, $http) {
    var captcha;
    $(function () {
        captcha = new CAPTCHA({
            selector: '#captcha',
            width: 400,
            height: 200
        });
        captcha.generate();
    });
    $scope.newCaptcha = function () {
        captcha.generate();
    };
    $scope.submitRegisterForm = function () {
        if (typeof $scope.registerData !== 'undefined') {
            if (captcha.validate($scope.registerData.captchaText)) {
                var postData = {username: $scope.registerData.username, password: $scope.registerData.password};
                $http({
                    method: 'POST',
                    url: '/api/users',
                    data: postData
                }).success(function (data, status, headers, config) {
                    notif({
                        msg: "<b>Success:</b> Registered",
                        type: "success",
                        position: "left"
                    });
                    window.location = "/#/";
                }).error(function (data, status, headers, config) {
                    notif({
                        msg: "<b>Error:</b> Registration failed",
                        type: "error",
                        position: "left"
                    });
                });
            } else {
                captcha.generate();
                notif({
                    msg: "<b>Error:</b> Registration failed",
                    type: "error",
                    position: "left"
                });
            }
        }
    };
});