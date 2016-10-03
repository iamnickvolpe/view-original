require('jquery');
var angular = require('angular');
require('angular-route');
require('angular-animate');
require('angular-moment');
require('angular-cookies');
var firebase = require('firebase');
require('./firebase-config.js');
require('angularfire');

var app = angular.module('app', [ 'ngRoute', 'ngAnimate', 'angularMoment', 'ngCookies', 'firebase', 'ngEnvVars', 'monospaced.qrcode' ]);

app.constant('VERSION', require('../package.json').version);
app.config(require('./config.js'));
app.run(require('./run.js'));
app.factory("Auth", require('./components/auth/auth.factory.js'));

app.controller('AppController', require('./components/app/app.controller.js'));
app.controller('HomeController', require('./routes/home/home.controller.js'));

app.directive('main', require('./components/main/main.directive.js'));
app.directive('time', require('./components/time/time.directive.js'));
app.directive('feed', require('./components/feed/feed.directive.js'));
app.directive('calendar', require('./components/calendar/calendar.directive.js'));
app.directive('weather', require('./components/weather/weather.directive.js'));
app.directive('settings', require('./components/settings/settings.directive.js'));
app.directive('login', require('./components/login/login.directive.js'));
app.directive('register', require('./components/register/register.directive.js'));
app.directive('notesView', require('./components/notes-view/notes-view.directive.js'));
app.directive('notesEdit', require('./components/notes-edit/notes-edit.directive.js'));
app.directive('categories', require('./components/categories/categories.directive.js'));
app.directive('remote', require('./components/remote/remote.directive.js'));
app.directive('subway', require('./components/subway/subway.directive.js'));
app.directive('ftux', require('./components/ftux/ftux.directive.js'));