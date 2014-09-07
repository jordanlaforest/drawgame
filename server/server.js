var web = require('./web.js');
var argv = require('minimist')(process.argv.slice(2));

if(!argv.dirs || !argv.port){
  console.log('You must specify directories to serve and a port.');
  process.exit(1);
}

web.start(argv.dirs.split(','), argv.port, argv.lrport);

var io = require('socket.io')(web.server);
io.on('connection', function(socket){
  console.log('A user connected: ' + socket.id);
  socket.broadcast.emit('userconnected', { name: 'test' });
  socket.on('disconnect', function() {
    io.emit('userdisconnect', { name: 'test' });
  });
  socket.on('chat', function(msg) {
    console.log("User said: " + msg);
    socket.broadcast.emit('chat', msg);
  });
});
