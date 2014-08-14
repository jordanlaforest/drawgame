'use strict';

/**
 * @ngdoc function
 * @name drawgameApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the drawgameApp
 */
var app = angular.module('drawgameApp');

app.controller('GameCtrl', function ($scope) {
  $scope.messages = [];
  $scope.players = [];
  $scope.drawingPlayer = 0;

  $scope.addMessage = function(username, message){
    $scope.messages.push({name: username, text: message});
  };
  $scope.addPlayer = function(id, username, score){
		$scope.players.push({id: id, username: username, score: score});
  };
  $scope.isDrawing = function(playerId){
    return $scope.drawingPlayer === playerId;
  };

  //Init
	$scope.addPlayer(0, "Bob", 4);
	$scope.addPlayer(1, "Patrick", 0);
	$scope.addPlayer(2, "Sandy", 7);

});

app.controller('PlayerListCtrl', function($scope){

});

app.controller('CanvasCtrl', function($scope){
});

app.controller('ChatCtrl', function($scope){
  $scope.sendMessage = function(){
		$scope.addMessage("Me", $scope.message);
		$scope.message = "";
  };

  $scope.addMessage("Bob", "Hey Guys!");
  $scope.addMessage("Patrick", "Hello!");
  $scope.addMessage("Sandy", "You guys suck at this!");
  $scope.addMessage("Bob", ":(");
});
