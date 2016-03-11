(function (window, document, $, undefined) {

    var possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    var defaults = {

        selector: "#captcha",
        text: null,
        randomText: true,
        randomColours: true,
        width: 300,
        height: 200,
        colour1: null,
        colour2: null,
        font: 'bold 48px "Comic Sans MS", cursive, sans-serif',
        onSuccess: function () { alert('Correct!'); }
    };

    var CAPTCHA = function (config) {

        var that = this;

        this._settings = $.extend({}, defaults, config || {});

        this._container = $(this._settings.selector);

        var canvasWrapper = $('<div>').appendTo(this._container);

        this._canvas = $('<canvas>').appendTo(canvasWrapper).width(this._settings.width).height(this._settings.height);

        var controlWrapper = $('<div>').appendTo(this._container);

        this._context = this._canvas.get(0).getContext("2d");

    };

    CAPTCHA.prototype = {

        generate: function () {

            var context = this._context;

            //if there's no text, set the flag to randomly generate some
            if (this._settings.text == null || this._settings.text == '') {
                this._settings.randomText = true;
            }

            if (this._settings.randomText) {
                this._generateRandomText();
            }

            if (this._settings.randomColours) {
                this._settings.colour1 = this._generateRandomColour();
                this._settings.colour2 = this._generateRandomColour();
            }

            var gradient1 = context.createLinearGradient(0, 0, this._settings.width, 0);
            gradient1.addColorStop(0, this._settings.colour1);
            gradient1.addColorStop(1, this._settings.colour2);

            context.fillStyle = gradient1;
            context.fillRect(0, 0, this._settings.width, this._settings.height);

            var gradient2 = context.createLinearGradient(0, 0, this._settings.width, 0);
            gradient2.addColorStop(0, this._settings.colour2);
            gradient2.addColorStop(1, this._settings.colour1);

            context.font = this._settings.font;
            context.fillStyle = gradient2;

            context.setTransform((Math.random() / 10) + 0.9,    //scalex
                0.1 - (Math.random() / 5),      //skewx
                0.1 - (Math.random() / 5),      //skewy
                (Math.random() / 10) + 0.9,     //scaley
                (Math.random() * 20) + 10,      //transx
                100);                           //transy

            context.fillText(this._settings.text, 0, 0);

            context.setTransform(1, 0, 0, 1, 0, 0);

            var numRandomCurves = Math.floor((Math.random() * 6) + 5);

            for (var i = 0; i < numRandomCurves; i++) {
                this._drawRandomCurve();
            }
        },

        validate: function (userText) {
            if (userText === this._settings.text) {
                return true;
            } else {
                return false;
            }
        },

        _drawRandomCurve: function () {

            var ctx = this._context;

            var gradient1 = ctx.createLinearGradient(0, 0, this._settings.width, 0);
            gradient1.addColorStop(0, Math.random() < 0.5 ? this._settings.colour1 : this._settings.colour2);
            gradient1.addColorStop(1, Math.random() < 0.5 ? this._settings.colour1 : this._settings.colour2);

            ctx.lineWidth = Math.floor((Math.random() * 4) + 2);
            ctx.strokeStyle = gradient1;
            ctx.beginPath();
            ctx.moveTo(Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)));
            ctx.bezierCurveTo(Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)),
                Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)),
                Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)));
            ctx.stroke();
        },

        _generateRandomText: function () {
            this._settings.text = '';
            var length = Math.floor((Math.random() * 3) + 4);
            for (var i = 0; i < length; i++) {
                this._settings.text += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            }
        },

        _generateRandomColour: function () {
            return "rgb(" + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ")";
        }
    };

    window.CAPTCHA = CAPTCHA || {};

}(window, document, jQuery));
