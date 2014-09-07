var express = require('express');
var app = express();
exports.server = require('http').Server(app);


module.exports = function(dirs, port, liveReloadPort){
  if(liveReloadPort){
    app.use(require('connect-livereload')({
      port: liveReloadPort
    }));
  }
  dirs.forEach(function(dir){
    app.use(express.static(dir));
  });
  app.listen(port, function() {
    console.log("Started web server on port " + port);
  });
};

