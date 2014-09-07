var express = require('express');
var app = express();
var http = require('http').Server(app);

module.exports = {
  server: http,

  start: function(dirs, port, liveReloadPort) {
    'use strict';

    //if using livereload, inject the livereload script
    if (liveReloadPort) {
      app.use(require('connect-livereload')({
        port: liveReloadPort
      }));
    }

    //statically serve all dirs in the passed in directory argument
    dirs.forEach(function(dir) {
      app.use(express.static(dir));
    });

    //start the app
    http.listen(port, function() {
      console.log('Started web server on port ' + port);
    });
  }
};
