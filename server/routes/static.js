import express from 'express';
import browserify from 'browserify';
import watchify from 'watchify';
import tinylr from 'tiny-lr';

export default function(app) {
  if(app.get('env') === 'development') {
    app.use( express.static('public') );

    tinylr().listen(35729);

    let b = browserify({
      cache: {},
      packageCache: {}//,
      //plugin: [watchify]
    });

    b.add('client/index.jsx');
    
    b.transform('babelify', {
      sourceMapRelative: '.'
    });

    b.bundle(bundle);

    b.on('update', (ids) => {
      tinylr.changed(...ids);
      b.bundle(bundle);
    });

    // browserify on command
    app.get('/bundle.js', (req, res) => {
      res.set('Content-Type', 'application/javascript');
      res.write(bundleData);
      res.end();
    });
  }
}

let bundleData;
function bundle(err, buf) {
  console.log(err);
  bundleData = buf;
}
