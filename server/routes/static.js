import express from 'express';
import watchify from 'watchify'
import tinylr from 'tiny-lr';
import fs from 'fs';
import lr from 'connect-livereload';

import { createBrowserify } from '../browserify/index.js';

export default function(app) {
  const env = app.get('env');
  const production = env === 'production';

  let b = createBrowserify(env);

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
