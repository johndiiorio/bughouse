app.controller('registerController', ($scope, $http, $location) => {
	let captcha;
	$(() => {
		captcha = new CAPTCHA({
			selector: '#captcha',
			width: 400,
			height: 200
		});
		captcha.generate();
	});
	$scope.checkUsernameAvailability = function () {
		$http({
			method: 'GET',
			url: `/api/users/username/${$scope.registerData.username}`
		}).success(data => {
            // Username is available
			if (data.length === 0) {
				$('#usernameAvailability').text('Username available');
				$('#usernameAvailability').css('color', 'green');
			} else { // Username not available
				$('#usernameAvailability').text('Username not available');
				$('#usernameAvailability').css('color', 'red');
			}
		}).error(() => {
			console.log('Error getting user by username');
		});
	};
	$scope.newCaptcha = function () {
		captcha.generate();
	};
	$scope.submitRegisterForm = function () {
		if (typeof $scope.registerData !== 'undefined') {
			if (captcha.validate($scope.registerData.captchaText)) {
				const postData = { username: $scope.registerData.username, password: $scope.registerData.password };
				$http({
					method: 'POST',
					url: '/api/users',
					data: postData
				}).success((data, status, headers) => {
					notif({
						msg: '<b>Success:</b> Registered',
						type: 'success',
						position: 'left',
						timeout: 2000
					});
					$location.path('/');
				}).error((data, status, headers) => {
					notif({
						msg: '<b>Error:</b> Registration failed',
						type: 'error',
						position: 'left',
						width: 'all',
						timeout: 2000
					});
				});
			} else {
				captcha.generate();
				notif({
					msg: '<b>Error:</b> Registration failed',
					type: 'error',
					position: 'left',
					width: 'all',
					timeout: 2000
				});
			}
		}
	};
});
