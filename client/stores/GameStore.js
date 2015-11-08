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

import DrawingStore from './DrawingStore';
import MessagesStore from './MessagesStore';

import { INIT_EVENT } from '../../common/EventConstants';

var GameStore = Marty.createStore({
  handlers: {
    onInitGame: GameConstants.INIT_GAME,
    onSendPlayer: GameConstants.SEND_PLAYER
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

    this.state.socket = new SocketWrapper('http://localhost:9000');

    let sendPlayer = () => GameActionCreators.sendPlayer(PlayerLocalSource.player);
    this.state.socket.on('connect', sendPlayer);

    MessagesSource.open(this.state.socket);
    DrawingSource.open(this.state.socket);

    MessagesStore.setSocket(this.state.socket);
    DrawingStore.setSocket(this.state.socket);
  },
  onQuitGame() {
    MessagesSource.close();
    DrawingSource.close();

    this.state.socket.close();

    MessagesStore.removeSocket();
    DrawingStore.removeSocket();
  },
  onSendPlayer(player) {
    this.state.socket.emit(INIT_EVENT, player);
  }
});

export default GameStore;
