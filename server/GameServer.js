import io from 'socket.io';
import AppState from '../common/AppState';
import createGame from '../common/Game';
import createPlayer from '../common/Player';

import {addPlayerToGame} from '../common/actions';

import {
  SERVER_MESSAGE_EVENT, REQUEST_GAMES,
  NAME_CHANGE_EVENT, JOIN_GAME_EVENT, CHAT_EVENT,
  PATH_START_EVENT, PATH_MOVE_EVENT, PATH_END_EVENT,
  INIT_EVENT_LOBBY, INIT_EVENT_GAME,
  ACTION,
  NAME_ERROR, JOIN_GAME_ERROR, UNEXPECTED_ERROR
}
from '../common/EventConstants';

export default class GameServer {

  constructor(httpServer) {
    this.io = io(httpServer);
    this.state = new AppState();
    
    //Create some test data
    let g1 = createGame('5', 'Test game');
    let g2 = createGame('6', 'Test game 2');
    g2.password = 'test';
    this.state.addGame(g1);
    this.state.addGame(g2);
    let p1 = createPlayer('10', 'Bob');
    let p2 = createPlayer('11', 'Bobert');
    this.state.addPlayer(p1);
    this.state.addPlayer(p2);
    this.state.addPlayerToGame(g1.get('id'), p1.get('id'));
    this.state.addPlayerToGame(g1.get('id'), p2.get('id'));
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
      this.listenForGamesRequest(socket);

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
    //let store = this.store;
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
      if(_this.state.getPlayer(playerId) != undefined){
        cb({err: _this.createError(UNEXPECTED_ERROR, 'Unexpected Error', 'Please refresh you\'re browser.')});
        return;
      }
      let p = createPlayer(playerId, name, 0);
      _this.state.addPlayer(p);

      socket.removeAllListeners(INIT_EVENT_LOBBY);
      socket.removeAllListeners(INIT_EVENT_GAME);

      _this.listenForNameEvent(socket);
      _this.listenForJoinEvent(socket);
      //_this.listenForGamesRequest(socket);

      const players = _this.state.players.toJS();
      const games = _this.state.games.toJS();
      if(event === INIT_EVENT_LOBBY){
        let res = {
          id: playerId,
          players: players,
          games: games
        };
        cb(res);
      }else{
        let joinError = _this.joinGame(data.gameId, playerId);
        if(joinError !== undefined){
          joinError.players = players; //Send the player list anyway
          cb(joinError);
          return;
        }

        let game = _this.state.getGame(data.gameId).toJS();
        let res = {
          id: playerId,
          players: players,
          game: game
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
      cb({games: this.state.games.toJS()});
    });
  }

  listenForNameEvent(socket) {
    socket.on(NAME_CHANGE_EVENT, (name, cb) => {
      let playerId = socket.id;
      let player = this.state.getPlayer(playerId);
      if(player != undefined){
        console.log(`${player.get('name')} wants to change name to ${name} ...`);

        let nameError = this.checkNameError(name);
        if (nameError != undefined) {
          cb(nameError);
          return;
        }
        let oldName = player.name;
        player.name = name;

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

      let game = this.state.getGame(data.gameId);
      console.log(game.players);
      cb({game: game});

    });
  }

  listenForChatEvent(socket) {
    socket.on(CHAT_EVENT, (message) => {
      let playerId = socket.id;
      let gameId = this.state.getPlayer(playerId).game;
      //TODO: Check if defined, also allow global chat
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
    let game = this.state.getGame(gameId);
    if(game === undefined){
      return {err: this.createError(JOIN_GAME_ERROR, 'Error joining game', 'Could not find the game requested')};
    }

    let action = addPlayerToGame(gameId, socket.id);
    this.state.addPlayerToGame(gameId, socket.id);
    //this.store.dispatch(action);
    socket.broadcast.to(gameId).emit(ACTION, [action]); //TODO: Fix protocol
    return undefined; //No errors
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
    let players = this.state.players;
    let nameTaken = false;
    players.forEach(p => {
      if(p.name === name){
        nameTaken = true; //TODO: Stop the loop if we find a match
      }
    })
    return !nameTaken;
  }

  createError(errType, title, msg){
    return {
      type: errType,
      title: title,
      msg: msg
    };
  }
}
