import express from 'express';
import browserify from 'browserify';
import watchify from 'watchify';
import tinylr from 'tiny-lr';

let changedIds;
let bundleData;
function bundle(err, buf) {
  console.log('Bundled. Errors: ' + err);
  bundleData = buf;
  if(changedIds !== undefined){
    tinylr.changed(...changedIds);
    changedIds = undefined;
  }
}

export default function(app) {
  app.use( express.static('public') );
  
  tinylr().listen(35729);

  let b = browserify({
    cache: {},
    packageCache: {},
    plugin: [watchify]
  });

  b.on('update', (ids) => {
    changedIds = ids;
    b.bundle(bundle);
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