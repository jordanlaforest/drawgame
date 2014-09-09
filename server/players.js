var players = {};

module.exports = {
  add: function(socket){
    if(!socket.player){
      socket.player = new this.Player();
    }
    players[socket.id] = socket.player;
  },
  get: function(uid){
    return players[uid];
  },
  remove: function(uid){
    player = players[uid];
    if(!player){ //If uid is no longer valid, create new player
      return new this.Player();
    }
    delete players[uid];
    return player;
  },
  Player: function(){ 
    this.name = '';
    this.score = 0;
  }
};
