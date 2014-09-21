'use strict';

var app = angular.module('drawgameApp');

app.controller('GameCtrl', function ($scope, socket) {
  $scope.messages = [];
  $scope.players = [];
  $scope.playerId = 0; //Which player is this client?
  $scope.drawingPlayer = 0;
  $scope.currentWord = 'Dog';

  $scope.addMessage = function(username, message){
    $scope.messages.push({name: username, text: message});
  };
  $scope.addPlayer = function(id, username, score){
    $scope.players.push({id: id, username: username, score: score});
  };
  $scope.isDrawing = function(playerId){
    return $scope.drawingPlayer === playerId;
  };
  $scope.getCurrentDrawingPlayer = function(){
    var retPlayer;
    $scope.players.forEach(function(player){
      if(player.id === $scope.drawingPlayer){
        retPlayer = player;
      }
    });
    return retPlayer;
  };

  //Init
  $scope.addPlayer(0, 'Bob', 4);
  $scope.addPlayer(1, 'Patrick', 0);
  $scope.addPlayer(2, 'Sandy', 7);

});

app.controller('PlayerListCtrl', function($scope) {

});

app.controller('CanvasCtrl', function($scope, socket) {
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');

  //experimental
  var width = canvas.width;
  var height = canvas.height;

  $scope.drawing = false;
  $scope.lastX = 0;
  $scope.lastY = 0;

  $scope.getMouseX = function(evt){
    //refresh these variables since i am just
    //inspecting elements to test scalability
    canvas = document.querySelector('canvas');
    width = canvas.width;
    height = canvas.height;

    return evt.clientX - canvas.getBoundingClientRect().left;
  };
  $scope.getMouseY = function(evt){
    //refresh these variables since i am just
    //inspecting elements to test scalability
    canvas = document.querySelector('canvas');
    width = canvas.width;
    height = canvas.height;
    return evt.clientY - canvas.getBoundingClientRect().top;
  };

  //helper method to divide by height
  function createScaledPoint(x, y) {
    return {
      x: x / width,
      y: y / height
    };
  }

  function scalePoint(point, width, height) {
    return {
      x: point.x * width,
      y: point.y * height
    };
  }

  socket.on('draw:start', function(point) {
    point = scalePoint(point, width, height);
    $scope.lastX = point.x;
    $scope.lastY = point.y;
  });
  socket.on('draw:move', function(point) {
    point = scalePoint(point, width, height);
    $scope.x = point.x;
    $scope.y = point.y;

    ctx.beginPath();
    ctx.moveTo($scope.lastX, $scope.lastY);
    ctx.lineTo($scope.x, $scope.y);
    ctx.stroke();

    $scope.lastX = $scope.x;
    $scope.lastY = $scope.y;
  });

  //works without this, but keeping just in case for future life cycle events.
  socket.on('draw:end', function(point) {
    point = scalePoint(point, width, height);
    $scope.lastX = point.x;
    $scope.lastY = point.y;
  });

  canvas.onmousedown = function(evt){
    evt.preventDefault();
    $scope.drawing = true;
    $scope.lastX = $scope.getMouseX(evt);
    $scope.lastY = $scope.getMouseY(evt);

    socket.emit('draw:start', createScaledPoint($scope.lastX, $scope.lastY));
  };

  canvas.onmousemove = function(evt) {
    if($scope.drawing){
      ctx.beginPath();
      ctx.moveTo($scope.lastX, $scope.lastY);
      ctx.lineTo($scope.getMouseX(evt), $scope.getMouseY(evt));
      ctx.stroke();

      $scope.lastX = $scope.getMouseX(evt);
      $scope.lastY = $scope.getMouseY(evt);

      socket.emit('draw:move', createScaledPoint($scope.lastX, $scope.lastY));
    }
  };

  canvas.onmouseup = canvas.onmouseleave = function(evt) {
    $scope.drawing = false;

    $scope.lastX = $scope.getMouseX(evt);
    $scope.lastY = $scope.getMouseY(evt);

    socket.emit('draw:end', createScaledPoint($scope.lastX, $scope.lastY));
  };

});

app.controller('ChatCtrl', function($scope, socket){
  $scope.sendMessage = function(){
    $scope.addMessage('Me', $scope.message);
    socket.emit('chat', $scope.message);
    $scope.message = '';
  };

  socket.on('chat', function(data) {
    $scope.addMessage(data.name, data.msg);
  }).destroyWith($scope);
  socket.on('servermessage', function(data) {
    $scope.addMessage('[INFO]', data.message);
  }).destroyWith($scope);

  $scope.addMessage('Bob', 'Hey Guys!');
  $scope.addMessage('Patrick', 'Hello!');
  $scope.addMessage('Sandy', 'You guys suck at this!');
  $scope.addMessage('Bob', ':(');
});
