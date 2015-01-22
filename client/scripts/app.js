import 'angular';
import 'angular-route';
import './angular-socket';

/**
 * @ngdoc overview
 * @name drawgameApp
 * @description
 * # drawgameApp
 *
 * Main module of the application.
 */
var app = angular
  .module('drawgameApp', [
    'ngRoute',
    'socket.io'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.tpl',
        controller: 'MainCtrl'
      })
      .when('/game/:gameId', {
        templateUrl: 'views/game.tpl',
        controller: 'GameCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

export default app;

import './controllers/game';
import './controllers/main';
import './controllers/player';
