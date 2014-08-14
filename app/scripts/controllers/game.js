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
  $scope.addMessage = function(username, message){
    $scope.messages.push({name: username, text: message});
  };
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
