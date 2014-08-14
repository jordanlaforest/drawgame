'use strict';

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
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  $scope.drawing = false;
  $scope.lastX = 0;
  $scope.lastY = 0;

  $scope.getMouseX = function(evt){
    return evt.clientX - canvas.getBoundingClientRect().left;
  }
  $scope.getMouseY = function(evt){
    return evt.clientY - canvas.getBoundingClientRect().top;
  }

  canvas.onmousedown = function(evt){
    $scope.drawing = true;
    $scope.lastX = $scope.getMouseX(evt);
    $scope.lastY = $scope.getMouseY(evt);
  };

  canvas.onmousemove = function(evt) {
    if($scope.drawing){
      ctx.beginPath();
      ctx.moveTo($scope.lastX, $scope.lastY);
      ctx.lineTo($scope.getMouseX(evt), $scope.getMouseY(evt));
			ctx.stroke();

			$scope.lastX = $scope.getMouseX(evt);
			$scope.lastY = $scope.getMouseY(evt);

    }
  };

	canvas.onmouseup = canvas.onmouseleave = function() {
    $scope.drawing = false;
  }

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
