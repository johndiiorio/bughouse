app.controller('registerController', function ($scope) {
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
        if (captcha.validate($scope.registerData.captchaText)) {
            alert("Correct captcha");
        } else {
            captcha.generate();
        }
    };
});