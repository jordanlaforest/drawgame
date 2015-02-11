import express from 'express';
import browserify from 'browserify';
import watchify from 'watchify'
import tinylr from 'tiny-lr';
import fs from 'fs';
import lr from 'connect-livereload';

export default function(app) {
  if(app.get('env') === 'production') {
    createBrowserify().bundle().pipe(fs.createWriteStream('../client/bundle.js'));
  }else{
    var lrPort = 35729;
    tinylr().listen(lrPort);

    var watcher = watchify(createBrowserify());
    watcher.on('update', (ids) => tinylr.changed(...ids));

    // browserify on command
    app.get('/bundle.js', (req, res) => {
      res.set('Content-Type', 'application/javascript');
      watcher
        .bundle() // create bundle.js
        .pipe(res); // send the file
    });

    // inject livereload script tag
    app.use(lr({
      port: lrPort
    }));
  }
  // statically serve client
  app.use( express.static('../client') );
}

function createBrowserify() {
    // start up browserify
    let b = browserify({
      basedir: '../client',
      cache: {}, packageCache: {}, fullPaths: true //for watchifys
    });
    // add the main file
    b.add('../client/index.jsx')
    // transform using 6to5
    // this is really stupid, you must have 6to5ify installed in client side
    // also need reactify to use marty js
    b.transform('6to5ify', {
      sourceMapRelative: '../client'
    });
    return b;
}
