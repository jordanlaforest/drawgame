import parseArgs from 'minimist';
import express from 'express';
import { Server } from 'http';
import GameServer from './GameServer';

let { port } = parseArgs(process.argv.slice(2));
port = port || process.env.PORT || 9000;
// start up the game server
let app = express();
let server = Server(app);
let env = app.get('env');
let configureServer;
if(env === 'production'){
  configureServer = require('./webServerConfig/prod').default;
}else{
  configureServer = require('./webServerConfig/dev').default;
}
configureServer(app);

server.listen(port, () => {
  console.log(`Started server on port: ${port} [${env}]`);
});

let gameServer = new GameServer(server);
gameServer.start();
