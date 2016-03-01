app.controller('homeController', function ($scope, $http) {
    //Hide the login notifications
    $(document).ready(function () {
        $("#notificationSuccess").hide();
        $("#notificationError").hide();
    });
    $('#minutesSlider').slider().on('slide', function (ev) {
        $('#minutesDisplay').text("Minutes: " + ev.value);
    });
    $('#incrementSlider').slider().on('slide', function (ev) {
        $('#incrementDisplay').text("Increment (seconds): " + ev.value);
    });
    //$('.btn').click(function() {
    //    $('.btn').removeClass('btn-primary').addClass('btn-secondary');
    //    $(this).addClass('btn-primary').removeClass('btn-secondary');
    //});
    $('#randomSlider').bootstrapSwitch();
});