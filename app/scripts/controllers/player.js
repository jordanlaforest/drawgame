'use strict';

var app = angular.module('drawgameApp');

app.controller('PlayerCtrl', function($scope, socket){
  var nameMsg     = 'Please choose a name:';
  var invalidMsg  = 'Invalid name, please try again.';
  $scope.name     = localStorage.getItem('player.name');

  this.validName = function(name){
    return !!name;
  };

  $scope.changeName = function(newName){
    if(this.validName(newName)){
      $scope.name = newName;
      localStorage.set('player.name', $scope.name);
      socket.emit('name', $scope.name);
    }
  };

  if(!this.validName($scope.name)){
    $scope.name = prompt(nameMsg);
    while(!this.validName($scope.name)){
      $scope.name = prompt(invalidMsg);
    }
    localStorage.setItem('player.name', $scope.name);
  }
  socket.on('connect', function(){
    socket.emit('init', { name: $scope.name });
  });
});
