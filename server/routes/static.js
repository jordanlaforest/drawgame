import express from 'express';
import browserify from 'browserify';
import watchify from 'watchify'
import tinylr from 'tiny-lr';
import fs from 'fs';
import lr from 'connect-livereload';

import deps from '../../common/deps';

import glob from 'glob';
import path from 'path';

function createBrowserify(production) {
    // start up browserify
    let b = browserify({
      basedir: '../client',
      debug: !production,
      cache: {}, packageCache: {}, fullPaths: true //for watchifys
    });
    // add the main file
    b.add('../client/index.jsx');

    // tell browserify that each library is externally requireable
    // this line tells browserify to NOT include all react/lib/*.js libraries
    deps.push(...glob.sync(path.resolve(__dirname, '../../client/node_modules/react/lib/*.js')));

    deps.forEach((lib) => b.external(lib));

    // transform using 6to5
    // this is really stupid, you must have 6to5ify installed in client side
    // also need reactify to use marty js
    b.transform('6to5ify', {
      sourceMapRelative: '../client'
    });
    return b;
}

export default function(app) {
  let production = app.get('env') === 'production';
  let b = createBrowserify(production);
  if(production) {
    b.bundle().pipe(fs.createWriteStream('../client/bundle.js'));
  } else {
    var lrPort = 35729;
    tinylr().listen(lrPort);

    var watcher = watchify(b);
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
