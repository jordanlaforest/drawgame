import { Flux } from 'flummox';

import PlayerActions from './actions/PlayerActions';
import MessageActions from './actions/MessageActions';
import GameActions from './actions/GameActions';
import DrawingActions from './actions/DrawingActions';

import MessageStore from './stores/MessageStore';
import PlayerStore from './stores/PlayerStore';
import GameStore from './stores/GameStore';
import DrawingStore from './stores/DrawingStore';

import SocketWrapper from './utils/SocketWrapper';

class MainApp extends Flux {
  constructor() {
    super();

    // single place that owns the socket === so good
    this.socket = new SocketWrapper('http://localhost:9000');

    this.createActions('messages', MessageActions, this.socket);
    this.createActions('players', PlayerActions, this.socket);
    this.createActions('games', GameActions);

    this.createStore('messages', MessageStore, this);
    this.createStore('players', PlayerStore, this);
    this.createStore('games', GameStore, this);

    this.createActions('drawing', DrawingActions, this.socket);
    this.createStore('drawing', DrawingStore, this);

    // load the games
    let gameActions = this.getActions('games');
    gameActions.getGames();

    // start to init the player
    let playerActions = this.getActions('players');
    playerActions.initPlayer();

  }
}

export default MainApp;