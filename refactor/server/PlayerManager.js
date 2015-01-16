import Player from '../common/Player';

export default class PlayerManager {
  constructor() {
    this.players = {};
  }

  addPlayer(socket, data) {
    if(socket.player !== undefined ) return false;
    socket.player = new Player(data);
    this.players[socket.id] = socket.player;
    return true;
  }

  // destructuring here just so we can pass the socket in directly.
  getPlayer({ id }) {
    return this.players[id];
  }

  removePlayer({ id }) {
    return (delete this.players[id]);
  }
}
