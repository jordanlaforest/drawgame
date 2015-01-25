import Marty from 'marty';

import GameConstants from '../constants/GameConstants';
import MessagesConstants from '../constants/MessagesConstants';
import DrawingConstants from '../constants/DrawingConstants';

import PlayersStore from './PlayersStore';

import MessagesSource from '../sources/MessagesSource';
import DrawingSource from '../sources/DrawingSource';
import PlayerLocalSource from '../sources/PlayerLocalSource';

import GameActionCreators from '../actions/GameActionCreators';

import SocketWrapper from '../utils/SocketWrapper';

import {
  INIT_EVENT,
  CHAT_EVENT,
  PATH_START_EVENT, PATH_MOVE_EVENT, PATH_END_EVENT
} from '../common/EventConstants';

var GameStore = Marty.createStore({
  handlers: {
    onInitGame: GameConstants.INIT_GAME,
    onSendPlayer: GameConstants.SEND_PLAYER,
    onSendMessage: MessagesConstants.SEND_MESSAGE,
    onSendPathStart: DrawingConstants.SEND_PATH_START,
    onSendPathEnd: DrawingConstants.SEND_PATH_END,
    onSendPathMove: DrawingConstants.SEND_PATH_MOVE
  },
  getInitialState() {
    return {
      currentWord: 'Dog',
      drawingPlayer: 0,
      player: null,
      socket: null
    };
  },
  getCurrentWord() {
    return this.state.currentWord;
  },
  getDrawingPlayer() {
    return PlayersStore.getPlayer(this.state.drawingPlayer) || { id: 0, username: '', score: 0 };
  },
  amIDrawing() {
    return this.isDrawing(PlayersStore.getThePlayer().id);
  },
  isDrawing(id) {
    return this.state.drawingPlayer === id;
  },
  onInitGame({ currentWord, currentlyDrawing }) {
    console.log('starting game');
    this.state.currentWord = currentWord;
    this.state.drawingPlayer = currentlyDrawing;
    this.hasChanged();

    this.socket = new SocketWrapper('http://localhost:9000');

    let sendPlayer = () => GameActionCreators.sendPlayer(PlayerLocalSource.player);
    this.socket.on('connect', sendPlayer);

    MessagesSource.open(this.socket);
    DrawingSource.open(this.socket);
  },
  onSendMessage(message) {
    this.socket.emit(CHAT_EVENT, message);
  },
  onSendPlayer(player) {
    this.socket.emit(INIT_EVENT, player);
  },
  onSendPathStart(point) {
    this.socket.emit(PATH_START_EVENT, point);
  },
  onSendPathEnd(point) {
    this.socket.emit(PATH_END_EVENT, point);
  },
  onSendPathMove(point) {
    this.socket.emit(PATH_MOVE_EVENT, point);
  }
});

export default GameStore;
