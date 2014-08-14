'use strict';

/**
 * @ngdoc function
 * @name drawgameApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the drawgameApp
 */
angular.module('drawgameApp')
  .controller('GameCtrl', function ($scope) {
    //stuff
    console.log("GameCtrl");
  }).controller('PlayerListCtrl', function(){
		console.log("PlayerListCtrl");
  }).controller('CanvasCtrl', function(){
		console.log("CanvasCtrl");
  }).controller('ChatCtrl', function(){
		console.log("ChatCtrl");
	});
