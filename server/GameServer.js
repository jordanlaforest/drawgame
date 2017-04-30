import io from 'socket.io';
import {
  SERVER_MESSAGE_EVENT, REQUEST_GAMES,
  NAME_CHANGE_EVENT, JOIN_GAME_EVENT, CHAT_EVENT,
  PATH_START_EVENT, PATH_MOVE_EVENT, PATH_END_EVENT,
  INIT_EVENT_LOBBY, INIT_EVENT_GAME,
  ACTION,
  NAME_ERROR, JOIN_GAME_ERROR, UNEXPECTED_ERROR
}
from '../common/EventConstants';

import {addGame, addPlayer, addPlayerToGame, setPlayerName,
  addPointToDrawing, endPathInDrawing} from '../common/actions';

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
    let _this = this;
    function initPlayer(data, cb, event){
      let playerId = socket.id;
      let { name } = data;
      let nameError = _this.checkNameError(name);
      if(nameError != undefined){
        cb(nameError);
        return;
      }
      //TODO: It should be very very unlikely but this should be updated to give the client a new unique id
      if(_this.getPlayer(playerId) != undefined){
        cb({err: _this.createError(UNEXPECTED_ERROR, 'Unexpected Error', 'Please refresh you\'re browser.')});
        return;
      }
      store.dispatch(addPlayer(playerId, name));

      socket.removeAllListeners(INIT_EVENT_LOBBY);
      socket.removeAllListeners(INIT_EVENT_GAME);

      _this.listenForNameEvent(socket);
      _this.listenForJoinEvent(socket);
      _this.listenForGamesRequest(socket);

      let state = store.getState();
      if(event === INIT_EVENT_LOBBY){
        let res = {
          players: state.get('players').toJS(),
          games: state.get('games').toJS()
        };
        cb(res);
      }else{
        let players = state.get('players');

        let joinError = _this.joinGame(data.gameId, playerId);
        if(joinError !== undefined){
          joinError.players = players.toJS(); //Send the player list anyway
          cb(joinError);
          return;
        }

        let game = state.get('games').get(data.gameId);
        let res = {
          players: players.toJS(),
          game: game.toJS()
        };
        cb(res);
      }
      let message = `${ name }[${ playerId }] has connected`;
      console.log(message);
    }
    socket.on(INIT_EVENT_LOBBY, (data, cb) => {
      initPlayer(data, cb, INIT_EVENT_LOBBY);
    });
    socket.on(INIT_EVENT_GAME, (data, cb) => {
      initPlayer(data, cb, INIT_EVENT_GAME);
    });
  }

  listenForGamesRequest(socket){
    socket.on(REQUEST_GAMES, (data, cb) => {
      cb({games: this.store.getState().get('games').toJS()});
    });
  }

  listenForNameEvent(socket) {
    socket.on(NAME_CHANGE_EVENT, (name, cb) => {
      let playerId = socket.id;
      let player = this.getPlayer(playerId);
      if(player != undefined){
        console.log(`${player.get('name')} wants to change name to ${name} ...`);

        let nameError = this.checkNameError(name);
        if (nameError != undefined) {
          cb(nameError);
          return;
        }
        let oldName = player.get('name');
        this.store.dispatch(setPlayerName(playerId, name));

        //Tell the players a name change occurred
        console.log(`${oldName} has changed their name to ${name}`);
        this.io.emit(NAME_CHANGE_EVENT, {
          id: playerId,
          newName: name
        });
      }else{
        console.err('Player not found in NAME_CHANGE_EVENT');
      }
    });
  }

  listenForJoinEvent(socket){
    socket.on(JOIN_GAME_EVENT, (data, cb) => {
      let joinError = this.joinGame(data.gameId, socket);
      if(joinError !== undefined){
        cb(joinError);
        return;
      }

      let game = this.store.getState().get('games').get(data.gameId);
      console.log(game.get('players'));
      cb({game: game.toJS()});

    });
  }

  listenForChatEvent(socket) {
    socket.on(CHAT_EVENT, (message) => {
      let playerId = socket.id;
      let gameId = this.getPlayer(playerId).get('game');
      socket.broadcast.to(gameId).emit(CHAT_EVENT, { 
        id: playerId,
        message: message
      });
    });
  }

  listenForPathEvents(socket) {
    this.relayEvent(socket, PATH_START_EVENT);
    this.relayEvent(socket, PATH_MOVE_EVENT);
    this.relayEvent(socket, PATH_END_EVENT);
  }

  joinGame(gameId, socket){
    let game = this.store.getState().get('games').get(gameId);
    if(game === undefined){
      return {err: this.createError(JOIN_GAME_ERROR, 'Error joining game', 'Could not find the game requested')};
    }

    let action = addPlayerToGame(gameId, socket.id);
    this.store.dispatch(action);
    socket.broadcast.to(gameId).emit(ACTION, [action]);
    return undefined; //No errors
  }

  getPlayer(playerId){
    return this.store.getState().get('players').get(playerId);
  }

  checkNameError(name){
    if(!this.isValidName(name)){
      return {err: this.createError(NAME_ERROR,
        'Invalid Name',
        'The name you\'ve entered is invalid, please try again.')
      };
    }
    if(!this.isNameAvailable(name)){
      return {err: this.createError(NAME_ERROR,
        'Name Taken',
        'The name you\'ve entered is already in use, please try again.')
      };
    }
    return undefined; //No errors
  }

  isValidName(name){
    return typeof name === 'string' && name !== '';
  }

  isNameAvailable(name){
    let players = this.store.getState().get('players');
    let player = players.find(p => p.get('name') === name);
    return player === undefined;
  }

  createError(errType, title, msg){
    return {
      type: errType,
      title: title,
      msg: msg
    };
  }
}
