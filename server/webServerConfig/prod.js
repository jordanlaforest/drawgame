import express from 'express';
import browserify from 'browserify';

let bundleData;
function bundle(err, buf) {
  console.log('Bundled. Errors: ' + err);
  bundleData = buf;
}

export default function(app) {
  app.use( express.static('public') );
  let b = browserify({
    cache: {},
    packageCache: {}
  });

  b.add('client/index.jsx');
  
  b.transform('babelify', {
    sourceMapRelative: '.'
  });

  b.bundle(bundle);
  app.get('/bundle.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.write(bundleData);
    res.end();
  });
  app.get('/game/:gameid', (req, res) => {
    res.sendFile('index.html', {root: __dirname + '/../../public/'});
  });

}