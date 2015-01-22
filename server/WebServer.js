/**
 * First parse the arguments
 */
import parseArgs from 'minimist';

let { argv } = process;
let { port } = parseArgs( argv.slice(2) );
port = port || 3000;

import express from 'express';
import http from 'http';
import GameServer from './GameServer';

// start up the game server
let app = http.Server(express());
let gameServer = new GameServer(app);
gameServer.start();
app.listen(port, () => {
  console.log(`Started game server on port: ${port}`);
});
