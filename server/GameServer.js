import io from 'socket.io';
import {
  SERVER_MESSAGE_EVENT,
  NAME_CHANGE_EVENT, CHAT_EVENT,
  PATH_START_EVENT, PATH_MOVE_EVENT, PATH_END_EVENT,
  INIT_EVENT_LOBBY, INIT_EVENT_GAME
}
from '../common/EventConstants';

import {addGame, addPlayer, addPlayerToGame} from '../common/actions';

import makeStore from './store';

export default class GameServer {

  constructor(httpServer) {
    this.io = io(httpServer);
    this.store = makeStore();
    
    //Create some test data
    this.store.dispatch(addGame('5', 'Test game'));
    this.store.dispatch(addGame('6', 'Test game 2'));

    this.store.dispatch(addPlayer('10', 'Bob'));
    this.store.dispatch(addPlayer('11', 'Bobert'));
    this.store.dispatch(addPlayerToGame('5', '10'));
    this.store.dispatch(addPlayerToGame('5', '11'));
  }

  sendServerMessage(message) {
    this.io.emit(SERVER_MESSAGE_EVENT, { message });
  }

  mirrorMessage(message, consolePrefix) {
    console.log(`${ consolePrefix || ''}${message}`);
    this.sendServerMessage(message);
  }

  relayEvent(socket, event) {
    socket.on(event, (data) => socket.broadcast.emit(event, data));
  }

  start() {
    this.io.on('connection', (socket) => {
      let { id } = socket;
      console.log(`A user(${id}) is connecting...`);

      this.listenForInitEvent(socket);

      // disconnect event
      socket.on('disconnect', () => {
        //if they are in a game
        //  remove player from socket.io room
        //  dispatch player leave game
        //dispatch remove player
        let name = 'someone';
        let message = `${name} has disconnected`;
        console.log(message);
      });
    });
  }

  listenForInitEvent(socket) {
    let store = this.store;
    function initPlayer(data, cb, event){
      let { id } = socket;
      let { name } = data;
      //isValidName()
      //check if name is taken
      //check if id is taken
      //dispatch addPlayer
      //add other listeners
      //remove init listeners
      if(event === INIT_EVENT_LOBBY){
        let state = store.getState();
        let data = {
          players: state.get('players').toJS(),
          games: state.get('games').toJS()
        };
        cb(data);
      }else{
        let state = store.getState();
        let players = state.get('players');
        let game = state.get('games').get(data.gameId);

        if(game === undefined){
          let res = {
            players: players,
            err: 'Invalid game'
          };
          cb(res);
          return;
        }
        let res = {
          players: players,
          game: game
        };
        cb(res);
      }
      let message = `${ name }[${ id }] has connected`;
      console.log(message);
    }
    socket.on(INIT_EVENT_LOBBY, (data, cb) => {
      initPlayer(data, cb, INIT_EVENT_LOBBY);
    });
    socket.on(INIT_EVENT_GAME, (data, cb) => {
      initPlayer(data, cb, INIT_EVENT_GAME);
    });
  }

  listenForNameEvent(socket) {
    // adding or updating name
    socket.on(NAME_CHANGE_EVENT, (name) => {
      let { player } = socket;
      console.log(`${player.name} wants to change name to ${name} ...`);

      if (!name) {
        console.log('New name invalid, name not changed');
      } else {
        let oldName = player.name;
        player.name = name;

        //Tell the players a name change occurred
        let msg = `${oldName} has changed their name to ${player.name}`;
        this.mirrorMessage(msg, 'Success: ');
      }
    });
  }

  listenForChatEvent(socket) {
    socket.on(CHAT_EVENT, (message) => {
      let { player : { name }, id } = socket;
      // player = socket.player.name;
      // id = socket.id;
      console.log(`${name}[${id}] said: ${message}`);
      socket.broadcast.emit(CHAT_EVENT, { name, message });
    });
  }

  listenForPathEvents(socket) {
    this.relayEvent(socket, PATH_START_EVENT);
    this.relayEvent(socket, PATH_MOVE_EVENT);
    this.relayEvent(socket, PATH_END_EVENT);
  }

  isValidName(name){
    return typeof name === 'string' && name !== '';
  }
}
