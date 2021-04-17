import io from 'socket.io';
import ServerState from './ServerState';

import {addPlayerToGame, removePlayerFromGame, addChatMessage, addServerMessage,
  addPointToDrawing, endPathInDrawing, createGame, gameStart, correctGuess, outOfTime, timerTick, intermissionOver} from '../common/modules/game';
import {addPlayer, removePlayer, createPlayer} from '../common/modules/players';

import {
  REQUEST_GAMES,
  NAME_CHANGE_EVENT, JOIN_GAME_EVENT, LEAVE_GAME_EVENT, CHAT_EVENT,
  ACTION, ACTION_FROMJS,
  NAME_ERROR, JOIN_GAME_ERROR, UNEXPECTED_ERROR
} from '../common/EventConstants';

export default class GameServer {

  constructor(httpServer) {
    this.io = io(httpServer);
    this.state = new ServerState();
    
    //Create some test data
    let g0 = createGame('4', 'Empty Game');
    let g1 = createGame('5', 'Test Game');
    let g2 = createGame('6', 'Passworded Game').set('password', 'test');
    let fg = createGame('7', 'Full Game').set('maxPlayers', 2);
    this.state.addGame(g0);
    this.state.addGame(g1);
    this.state.addGame(g2);
    this.state.addGame(fg);

    let p1 = createPlayer('10', 'Bob');
    let p2 = createPlayer('11', 'Bobert');
    let p3 = createPlayer('12', 'Bobby');
    let p4 = createPlayer('13', 'Bobertson');
    this.state.addPlayer(p1);
    this.state.addPlayer(p2);
    this.state.addPlayer(p3);
    this.state.addPlayer(p4);

    this.state.addPlayerToGame(g1.get('id'), p1.get('id'));
    this.state.addPlayerToGame(g1.get('id'), p2.get('id'));

    this.state.addPlayerToGame(fg.get('id'), p3.get('id'));
    this.state.addPlayerToGame(fg.get('id'), p4.get('id'));
  }

  start() {
    this.io.on('connection', (socket) => {
      let { id } = socket;
      console.log(`A user[${id}] is connecting...`);

      this.listenForInitEvent(socket);

      socket.on('disconnect', () => {
        let player = this.state.getPlayer(socket.id);
        this.leaveGame(socket);
        let action = removePlayer(socket.id);
        this.state.removePlayer(socket.id);
        socket.broadcast.emit(ACTION, [action]);
        let name = player !== undefined ? player.get('name') : 'someone';
        let message = `${name} has disconnected`;
        console.log(message);
      });
    });
  }

  listenForInitEvent(socket) {
    let _this = this;
    function initPlayer(data, cb){
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
      let p = createPlayer(playerId, name);
      _this.state.addPlayer(p);
      let action = addPlayer(p.toJS());
      socket.broadcast.emit(ACTION_FROMJS, [action]);

      socket.removeAllListeners('LOGIN');

      _this.listenForNameEvent(socket);
      _this.listenForJoinEvent(socket);
      _this.listenForGamesRequest(socket);
      _this.listenForChatEvent(socket);
      _this.listenForLeaveEvent(socket);
      _this.listenForPathEvents(socket);

      const games = _this.state.games.valueSeq().toJS();
      const players = _this.state.players.toJS();
      if(data.gameId === undefined){
        let res = {
          playerId,
          players,
          games
        };
        cb(res);
      }else{
        let joinError = _this.joinGame(data.gameId, playerId);
        if(joinError !== undefined){
          cb(joinError);
          return;
        }

        let game = _this.state.getGame(data.gameId).toJS();
        let res = {
          playerId,
          players,
          game
        };
        cb(res);
      }
      let message = `${ name }[${ playerId }] has connected`;
      console.log(message);
    }
    socket.on('LOGIN', (data, cb) => {
      initPlayer(data, cb);
    });
  }

  listenForGamesRequest(socket){
    socket.on(REQUEST_GAMES, (data, cb) => {
      cb({games: this.state.games.valueSeq().toJS()});
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
        console.error('Player not found in NAME_CHANGE_EVENT');
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
      cb({game: game});

    });
  }

  listenForLeaveEvent(socket) {
    socket.on(LEAVE_GAME_EVENT, () => {
      this.leaveGame(socket);
    });
  }

  listenForChatEvent(socket) {
    socket.on(CHAT_EVENT, (message) => {
      let playerId = socket.id;
      let gameId = this.state.getPlayer(playerId).get('gameId');
      if(gameId !== undefined){
        if(message.startsWith('\\')){
          this.serverCommand(message.substring(1), socket);
        }else{
          let action = addChatMessage(this.state.getPlayer(playerId).get('name'), message);
          this.io.to(gameId).emit(ACTION_FROMJS, [action]);
        }
      }
    });
  }

  serverCommand(command, socket){
    let cmd = command.split(' ')[0];
    let args = command.substring(cmd.length + 1);
    let player = this.state.getPlayer(socket.id);
    let gameId = player.get('gameId');
    let game = this.state.getGame(gameId);
    switch(cmd){
      case 'broadcast': {
        let msgAction = addServerMessage(args);
        this.io.emit(ACTION, [msgAction]);
        break;
      }
      case 'startgame': { //argument is the word to set
        let actionWithWord = gameStart(30, args); //TODO: Have round time in game options
        this.applyActionToGame(actionWithWord, gameId);

        //Send the action with the secret word to only the drawing player
        let drawingId = game.get('players').get(0).get('id'); //CurrentlyDrawingPlayer should be 0 at the start of the game
        this.io.in(gameId).clients((error, ids) => {
          if(error) throw error;
          ids.forEach(id => {
            if(id !== drawingId){
              this.io.sockets.sockets[id].emit(ACTION, [gameStart(30)]);
            }else{
              this.io.sockets.sockets[id].emit(ACTION, [actionWithWord]);
            }
          });
        });
        break;
      }
      case 'autoguess': { //argument is the index of the "guessing" player in the games player list
        let playerIndex = args === '' ? game.get('players').findIndex(p => p.get('id') === socket.id) : parseInt(args, 10);
        if(isNaN(playerIndex)){
          socket.emit(ACTION, [addServerMessage('Invalid argument')]);
        }else{
          let action = correctGuess(playerIndex, 15, game.get('currentWord'));
          this.applyActionToGame(correctGuess(playerIndex, 15), gameId);
          this.io.to(gameId).emit(ACTION, [action]);
        }
        break;
      }
      case 'skiptimer': {
        this.state.clearTimer(gameId);
        let action = game.inIntermission ? game.winner ? gameStart(30, 'NewWord') : intermissionOver(30) : outOfTime(15, game.currentWord);
        this.io.to(gameId).emit(ACTION, [action]);
        this.applyActionToGame(action, gameId);
        break;
      }
      default: {
        console.log('Unknown command: ' + command);
      }
    }
  }

  listenForPathEvents(socket) {
    socket.on('ADD_POINT_TO_DRAWING', point => {
      this.handlePathEvent(socket, addPointToDrawing(point));
    });
    socket.on('END_PATH_IN_DRAWING', () => {
      this.handlePathEvent(socket, endPathInDrawing());
    });
  }

  handlePathEvent(socket, pathAction){
    let gameId = this.state.getPlayer(socket.id).get('gameId');
    let isPlayerDrawing = this.state.checkPlayerDrawing(socket.id);
    if(gameId !== undefined && isPlayerDrawing){
      this.applyActionToGame(pathAction, gameId);
      socket.to(gameId).emit(ACTION_FROMJS, [pathAction]);
    }
  }

  joinGame(gameId, socket){
    let game = this.state.getGame(gameId);
    if(game === undefined){
      console.log('Could not join gameId: ');
      return {err: this.createError(JOIN_GAME_ERROR, 'Error joining game', 'Could not find the game requested')};
    }

    this.leaveGame(socket); //Leave game if currently in one

    let action = addPlayerToGame(socket.id);
    this.state.addPlayerToGame(gameId, socket.id);
    socket.join(gameId);
    let msgAction = addServerMessage(this.state.getPlayer(socket.id).get('name') + ' has joined the game');
    socket.to(gameId).emit(ACTION, [action, msgAction]);
    return undefined; //No errors
  }

  leaveGame(socket){
    let player = this.state.getPlayer(socket.id);
    if(player != undefined && player.has('gameId')){
      let gameId = player.get('gameId');
      socket.leave(gameId);
      let a = removePlayerFromGame(socket.id);
      this.state.removePlayerFromGame(gameId, socket.id);
      let msgAction = addServerMessage(player.get('name') + ' has left the game');
      socket.to(gameId).emit(ACTION, [a, msgAction]);
    }
  }

  applyActionToGame(action, gameId){
    this.state.applyActionToGame(action, gameId);
    if(action.type === correctGuess.toString()){
      this.state.clearTimer(gameId);
    }

    //Check for actions needing a timer
    if(action.payload?.timer){ 
      let secs = action.payload.timer;
      let iv = setInterval(() => {
        secs -= 1;
        this.state.applyActionToGame(timerTick(), gameId);
        if(secs <= 0){
          this.state.clearTimer(gameId);
          let game = this.state.getGame(gameId);
          let action = game.inIntermission ? game.winner ? gameStart(30, 'NewWord') : intermissionOver(30) : outOfTime(15, game.currentWord);
          this.io.to(gameId).emit(ACTION, [action]);
          this.applyActionToGame(action, gameId);
        }
      }, 1000);
      this.state.saveTimer(gameId, iv);
    }
  }

  // Error Checking

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
      if(p.get('name') === name){
        nameTaken = true; //TODO: Stop the loop if we find a match
      }
    });
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
