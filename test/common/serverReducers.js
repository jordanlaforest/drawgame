import {Map, List} from 'immutable';
import {should} from 'chai';
should();

import * as s from '../../common/reducers/server';

describe('server game/player management', () => {

  describe('addGame', () => {
    it('adds a game to an empty game list', () => {
      const state = Map();
      const id = 8;
      const name = 'Bob\'s Game';
      const newState = s.addGame(state, id, name);
      newState.should.equal(Map().set(id, Map({
        id: id,
        name: name,
        password: '',
        maxPlayers: 5,
        currentlyDrawingPlayer: 0,
        players: List(),
        currentWord: '',
        drawingData: Map(Map({paths: List(), curPath: List()})),
        inIntermission: false,
        chatMessages: List()
      })));
    });
  });

  describe('removeGame', () => {
    it('removes a game from the server', () => {
      const state = Map().set(0, Map({
        id: 0,
        name: 'Bob\'s Game',
        password: 'secret',
        maxPlayers: 5,
        currentlyDrawingPlayer: 0,
        players: Map().set(0, Map({
          score: 7
        })),
        drawingData: Map()
      })).set(1, Map({
        id: 1,
        name: 'Bobert\'s Game',
        password: 'hunter2',
        maxPlayers: 6,
        currentlyDrawingPlayer: 0,
        players: Map().set(0, Map({
          score: 3
        })),
        drawingData: Map()
      }));
      const gameId = 0;
      const newState = s.removeGame(state, gameId);
      newState.should.equal(Map().set(1, Map({
        id: 1,
        name: 'Bobert\'s Game',
        password: 'hunter2',
        maxPlayers: 6,
        currentlyDrawingPlayer: 0,
        players: Map().set(0, Map({
          score: 3
        })),
        drawingData: Map()
      })));
    });
  });

  describe('addPlayerToServer', () => {
    it('adds a player to an empty player list', () => {
      const state = Map();
      const player = Map({
        id: 0,
        name: 'Bob'
      });
      const newState = s.addPlayerToServer(state, player);
      newState.should.equal(Map().set(0, Map({
        id: 0,
        name: 'Bob'
      })));
    });
  });

  describe('removePlayerFromServer', () => {
    it('removes a player from the server', () => {
      const state = Map().set(0, Map({
        id: 0,
        name: 'Bob'
      })).set(1, Map({
        id: 1,
        name: 'Bobert'
      }));
      const playerId = 0;
      const newState = s.removePlayerFromServer(state, playerId);
      newState.should.equal(Map().set(1, Map({
        id: 1,
        name: 'Bobert'
      })));
    });
  });

  describe('setPlayerName', () => {
    it('sets a player\'s name', () => {
      const state = Map().set(0, Map({
        id: 0,
        name: 'Bob'
      })).set(1, Map({
        id: 1,
        name: 'Bobert'
      }));
      const playerId = 1;
      const newName = 'Boberta';
      const newState = s.setPlayerName(state, playerId, newName);
      newState.should.equal(Map().set(0, Map({
        id: 0,
        name: 'Bob'
      })).set(1, Map({
        id: 1,
        name: 'Boberta'
      })));
    });
  });
});