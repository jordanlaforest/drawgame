var web     = require('./web.js');
var players = require('./players.js');
var argv    = require('minimist')(process.argv.slice(2));

if(!argv.dirs || !argv.port){
  console.log('You must specify directories to serve and a port.');
  process.exit(1);
}

web.start(argv.dirs.split(','), argv.port, argv.lrport);

var io = require('socket.io')(web.server);

io.on('connection', function(socket){
  console.log('A user(' + socket.id +') is connecting...');
  socket.on('init', function(data) {
    socket.player = new players.Player();
    if(socket.id != data.uid){ //Player is reconnecting
      socket.player = players.remove(data.uid);
      socket.emit('uid', socket.id);
    }
    socket.player.name = data.name;
    players.add(socket);
    console.log(socket.player.name + '(' + socket.id + ') has connected');
    socket.broadcast.emit('userconnected', { name: socket.player.name });
  });
  socket.on('disconnect', function() {
    io.emit('userdisconnect', { name: socket.player.name });
  });
  socket.on('chat', function(msg) {
    console.log(socket.player.name + " said: " + msg);
    socket.broadcast.emit('chat', {
      name: socket.player.name,
      msg: msg
    });
  });
});
