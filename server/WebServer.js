import parseArgs from 'minimist';
import express from 'express';
import { Server } from 'http';
import GameServer from './GameServer';
import configureServer from './webServerConfig';

let { port } = parseArgs(process.argv.slice(2));
port = port || process.env.PORT || 9000;
// start up the game server
let app = express();
let server = Server(app);
let env = app.get('env');
app.use(express.static('public'));
app.get('/game/:gameid', (req, res) => {
  res.sendFile('index.html', {root: __dirname + '/../../public/'});
});
configureServer(app);

server.listen(port, () => {
  console.log(`Started server on port: ${port} [${env}]`);
});

let gameServer = new GameServer(server);
gameServer.start();
