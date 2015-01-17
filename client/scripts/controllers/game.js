import {
  SERVER_MESSAGE_EVENT,
  INIT_EVENT, NAME_CHANGE_EVENT, CHAT_EVENT, CREATE_UID_EVENT,
  DRAW_START_EVENT, DRAW_MOVE_EVENT, DRAW_END_EVENT
}
from '../../../common/EventConstants';

let app = angular.module('drawgameApp');

class GameController {
  constructor($scope) {
    this.messages = [];
    this.players = [];

    this.myId = 0;
    this.drawingPlayer = 0;
    this.currentWord = 'Dog';
  }

  addMessage(name, text) {
    this.messages.push({ name, text });
  }

  addPlayer(id, username, score) {
    this.players.push({ id, username, score });
  }

  get amIDrawing() {
    return this.myId === this.drawingPlayer;
  }
}

app.controller('GameCtrl', function ($scope, socket) {
  $scope.messages = [];
  $scope.players = [];

  //connect to the server, get my id and who's turn it is
  $scope.initialize = function() {
    $scope.myId = 0; //Which player is this client?
    $scope.drawingPlayer = 0;
    $scope.currentWord = 'Dog'; //i think only the user currently drawing
                                //should have this?
  };

  $scope.addMessage = function(name, text){
    $scope.messages.push({ name, text });
  };
  $scope.addPlayer = function(id, username, score){
    $scope.players.push({ id, username, score });
  };
  $scope.amIDrawing = function(myId){
    return $scope.drawingPlayer === myId;
  };
  $scope.getCurrentDrawingPlayer = function(){
    var retPlayer;
    $scope.players.forEach((player) => {
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

  $scope.initialize();
});

app.controller('PlayerListCtrl', function($scope) {

});

app.controller('CanvasCtrl', function($scope, socket) {
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');
  let { width, height } = canvas;

  //helper method to divide by height
  function unscalePoint({ x, y }) {
    return {
      x: x / width,
      y: y / height
    };
  }

  function scalePoint({ x, y }) {
    return {
      x: x * width,
      y: y * height
    };
  }

  $scope.drawing = false;
  $scope.lastX = 0;
  $scope.lastY = 0;

  $scope.getMouseX = function({ clientX }){
    //refresh these variables since i am just
    //inspecting elements to test scalability
    canvas = document.querySelector('canvas');
    let { width, height } = canvas;

    return clientX - canvas.getBoundingClientRect().left;
  };
  $scope.getMouseY = function({ clientY }){
    //refresh these variables since i am just
    //inspecting elements to test scalability
    canvas = document.querySelector('canvas');
    let { width, height } = canvas;

    return clientY - canvas.getBoundingClientRect().top;
  };

  let setScaled = (point) => {
    let { x, y } = scalePoint(point);
    $scope.lastX = x;
    $scope.lastY = y;
  };

  socket.on(DRAW_START_EVENT, setScaled);
  socket.on(DRAW_END_EVENT, setScaled);

  socket.on(DRAW_MOVE_EVENT, (point) => {
    let { lastX, lastY } = $scope;
    let { x, y } = scalePoint(point);

    // move the context
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    $scope.x = x;
    $scope.y = y;

    $scope.lastX = $scope.x;
    $scope.lastY = $scope.y;
  });

  canvas.onmousedown = function(evt){
    evt.preventDefault();
    $scope.drawing = true;
    $scope.lastX = $scope.getMouseX(evt);
    $scope.lastY = $scope.getMouseY(evt);

    socket.emit(DRAW_START_EVENT, unscalePoint({x: $scope.lastX, y: $scope.lastY}));
  };

  canvas.onmousemove = function(evt) {
    if($scope.drawing){
      ctx.beginPath();
      ctx.moveTo($scope.lastX, $scope.lastY);
      ctx.lineTo($scope.getMouseX(evt), $scope.getMouseY(evt));
      ctx.stroke();

      $scope.lastX = $scope.getMouseX(evt);
      $scope.lastY = $scope.getMouseY(evt);

      socket.emit(DRAW_MOVE_EVENT, unscalePoint({x: $scope.lastX, y: $scope.lastY}));
    }
  };

  canvas.onmouseup = canvas.onmouseleave = function(evt) {
    $scope.drawing = false;

    $scope.lastX = $scope.getMouseX(evt);
    $scope.lastY = $scope.getMouseY(evt);

    socket.emit(DRAW_END_EVENT, scalePoint($scope.lastX, $scope.lastY));
  };

});

app.controller('ChatCtrl', function($scope, socket){
  $scope.sendMessage = function(){
    //TODO don't send chat until it actually gets sent?
    $scope.addMessage('Me', $scope.message);
    socket.emit('chat', $scope.message);
    $scope.message = '';
  };

  socket.on('chat', function(data) {
    $scope.addMessage(data.name, data.msg);
  }).destroyWith($scope);
  socket.on(SERVER_MESSAGE_EVENT, function(data) {
    $scope.addMessage('[INFO]', data.message);
  }).destroyWith($scope);

  $scope.addMessage('Bob', 'Hey Guys!');
  $scope.addMessage('Patrick', 'Hello!');
  $scope.addMessage('Sandy', 'You guys suck at this!');
  $scope.addMessage('Bob', ':(');
});
