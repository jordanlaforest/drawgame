'use strict';

var web = require('./web.js');
var players = require('./players.js');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.dirs || !argv.port) {
  console.log('You must specify directories to serve and a port.');
  process.exit(1);
}

web.start(argv.dirs.split(','), argv.port, argv.lrport);

var io = require('socket.io')(web.server);

function broadcastMessage(message) {
 io.emit('servermessage', {
    message: message
  });
}

io.on('connection', function(socket) {

  //connection event
  console.log('A user(' + socket.id + ') is connecting...');

  //as the page initializes
  socket.on('init', function(data) {
    socket.player = new players.Player();
    if (socket.id !== data.uid) { //Player is reconnecting
      socket.player = players.remove(data.uid);
      socket.emit('uid', socket.id);
    }
    socket.player.name = data.name;
    players.add(socket);

    //TODO reuse this messag
    console.log(socket.player.name + '(' + socket.id + ') has connected');
    broadcastMessage(socket.player.name + ' has connected');
  });

  //adding or updating name
  socket.on('name', function(name) {
    console.log(socket.player.name + ' wants to change name to ' + name + '...');
    if (!name) {
      console.log('New name invalid, name not changed');
    } else {
      var oldName = socket.player.name;
      socket.player.name = name;

      //Tell the players a name change occurred
      var msg = oldName + ' has changed their name to ' + socket.player.name;
      broadcastMessage(msg);
      console.log('Success: ' + msg);
    }
  });

  //disconnect event
  socket.on('disconnect', function() {
    var msg = socket.player.name + ' has disconnected';

    console.log(msg);
    broadcastMessage(msg);
  });

  //chat event
  socket.on('chat', function(msg) {
    console.log(socket.player.name + ' said: ' + msg);
    socket.broadcast.emit('chat', {
      name: socket.player.name,
      msg: msg
    });
  });
});
