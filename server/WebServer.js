/**
 * First parse the arguments
 */
import parseArgs from 'minimist';

let { env: { NODE_ENV }, argv, cwd } = process;
let { port } = parseArgs( argv.slice(2) );
port = port || 9000;

import express from 'express';
import Moonboots from 'moonboots';
import serveIndex from 'serve-index';
import path from 'path';
import { Server } from 'http';

import GameServer from './GameServer';

let clientApp = new Moonboots({
  main: path.resolve(__dirname, '../client/scripts/app.js'),
  browserify: { transforms: [ '6to5ify' ] },
  sourceMaps: true,
  minify: false,
  developmentMode: true
});

let app = express();
let http = Server(app);

let gameServer = new GameServer(http);

clientApp.on('ready', () => {
  let mainScript = clientApp.jsFileName();
  app.set('view engine', 'jade');
  // app.set('views', './views');

  app.use( express.static('client') );
  // app.use( serveIndex('client') );

  app.get( '/', (req, res) => {
    res.render('index', { mainScript });
  });

  // get the bundle
  app.get(`/${mainScript}`, (req, res) =>
    clientApp.jsSource( (err, js) => {
      res.set('Content-Type', 'application/javascript');
      res.send(js);
    })
  );

  http.listen(port, () => {
    console.log(`Started web server on port: ${port}`);
    gameServer.start();
  });
});
