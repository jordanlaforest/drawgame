/**
 * First parse the arguments
 */
import parseArgs from 'minimist';

let { argv } = process;
let { port } = parseArgs( argv.slice(2) );
port = port || 3000;

import express from 'express';
import { Server } from 'http';
import GameServer from './GameServer';

// start up the game server
let app = express();
let server = Server(app);

import attachAPI from './routes/api';
attachAPI(app);

app.set('env', 'development');
import staticServe from './routes/static';
staticServe(app);

server.listen(port, () => {
  console.log(`Started game server on port: ${port}`);
});

let gameServer = new GameServer(server);
gameServer.start();
