import {Map, List} from 'immutable';
import {should as s} from 'chai';
let should = s();

import * as g from '../../common/reducers/game.js';

function createInitialGameState(){
  //Some points to fill the initial data with
  let point1 = {
    x: 101.2,
    y: 53.7
  };
  let point2 = {
    x: 62.2,
    y: 35.9
  };
  let point3 = {
    x: 94,
    y: 88.7
  };
  let point4 = {
    x: 51.3,
    y: 124.4
  };
  let point5 = {
    x: 152.1,
    y: 87
  };
  return Map({
    id: 4,
    name: 'Bob\'s game',
    password: '1234',
    maxPlayers: 5,
    players: List([Map({
      id: 0,
      score: 2
    }), Map({
      id: 7,
      score: 5
    }), Map({
      id: 9,
      score: 4
    })]),
    currentlyDrawingPlayer: 1,
    currentWord: 'Dog',
    drawingData: Map({
      paths: List([List([point1, point2]), List([point3, point4])]),
      curPath: List([point2, point5])
    }),
    intermission: false
  });
}

describe('game state logic', () => {
  describe('setCurrentWord', () => {
    const state = createInitialGameState();
    const word = 'Cat';
    const newState = g.setCurrentWord(state, word);

    it('sets the game\'s current word', () => {
      newState.get('currentWord').should.equal(word);
    });

    it('should not modify the rest of the game', () => {
      const restState = state.remove('currentWord');
      const restNewState = newState.remove('currentWord');
      restState.should.equal(restNewState);
    });
  });

  describe('setGameName', () => {
    const state = createInitialGameState();
    const name = 'Bobert\'s Game';
    const newState = g.setGameName(state, name);

    it('sets the game\'s name', () => {
      newState.get('name').should.equal(name);
    });

    it('should not modify the rest of the game', () => {
      const restState = state.remove('name');
      const restNewState = newState.remove('name');
      restState.should.equal(restNewState);
    });
  });

  describe('addPlayerToGame', () => {
    const state = createInitialGameState();
    const playerId = 11;
    const newState = g.addPlayerToGame(state, playerId);

    it('adds a player to the game', () => {
      newState.get('players').last().get('id').should.equal(playerId);
    });

    it('should initialize the new player\'s score to 0', () => {
      newState.get('players').last().get('score').should.equal(0);
    });

    it('should not modify the rest of the game', () => {
      newState.get('players').size.should.equal(state.get('players').size + 1);
      const restState = state.remove('players');
      const restNewState = newState.remove('players');
      restState.should.equal(restNewState);
    });
  });

  describe('removePlayerFromGame', () => {
    const state = createInitialGameState();
    const playerId = 7;
    const newState = g.removePlayerFromGame(state, playerId);

    it('removes a player from the game', () => {
      should.equal(newState.get('players').find((player) =>{
        return player.get('id') === playerId;
      }), undefined);
    });

    it('should not modify the rest of the game', () => {
      newState.get('players').size.should.equal(state.get('players').size - 1);
      const restState = state.remove('players');
      const restNewState = newState.remove('players');
      restState.should.equal(restNewState);
    });
  });

  describe('addPointToDrawing', () => {
    const state = createInitialGameState();
    const point = Map({
      x: 55.5,
      y: 66.6
    });
    const newState = g.addPointToDrawing(state, point);

    it('adds a point to the drawing', () => {
      newState.get('drawingData').get('curPath').last().should.equal(point);
    });

    it('should not modify the rest of the game', () => {
      newState.get('drawingData').get('curPath').size.should.equal(state.get('drawingData').get('curPath').size + 1);
      const restState = state.update('drawingData', (data) => {
        data.remove('curPath');
      });
      const restNewState = newState.update('drawingData', (data) => {
        data.remove('curPath');
      });
      restState.should.equal(restNewState);
    });
  });

  describe('endPathInDrawing', () => {
    const state = createInitialGameState();
    const newState = g.endPathInDrawing(state);

    it('should push curPath into paths', () => {
      newState.get('drawingData').get('paths').last().should.equal(state.get('drawingData').get('curPath'));
    });

    it('should make curPath empty', () => {
      newState.get('drawingData').get('curPath').isEmpty().should.be.true;
    });

    it('should not modify the rest of the game', () => {
      newState.get('drawingData').get('paths').size.should.equal(state.get('drawingData').get('paths').size + 1);
      const restState = state.remove('drawingData');
      const restNewState = newState.remove('drawingData');
      restState.should.equal(restNewState);
    });
  });

  describe('setCurrentlyDrawing', () => {
    const state = createInitialGameState();
    const playerIndex = 2;
    const newState = g.setCurrentlyDrawing(state, playerIndex);

    it('sets the currently drawing player', () => {
      newState.get('currentlyDrawingPlayer').should.equal(playerIndex);
    });

    it('should not modify the rest of the game', () => {
      const restState = state.remove('currentlyDrawingPlayer');
      const restNewState = newState.remove('currentlyDrawingPlayer');
      restState.should.equal(restNewState);
    });
  });

  describe('addToScore', () => {
    const state = createInitialGameState();
    const playerIndex = 0;
    const scoreIncAmount = 3;
    const newState = g.addToScore(state, playerIndex, scoreIncAmount);

    it('adds to the players score', () => {
      newState.get('players').get(playerIndex).get('score').should.equal(state.get('players').get(playerIndex).get('score') + scoreIncAmount);
    });

    it('should not modify the rest of the game', () => {
      let trueIterations = 0;
      let iterations = newState.get('players').forEach((player, index) => {
        if(index !== playerIndex){
          let result = player.get('score') === state.get('players').get(index).get('score');
          if(result){
            trueIterations ++;
          }
          return result;
        }
        trueIterations++;
        return true;
      });
      trueIterations.should.equal(iterations);
    });
  });

});