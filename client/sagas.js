import {push} from 'connected-react-router/immutable';
import {take, put, call, race, all, takeEvery, takeLatest, select} from 'redux-saga/effects';
import {eventChannel, END} from 'redux-saga';
import {fromJS} from 'immutable';

import io from 'socket.io-client';

import {ACTION, ACTION_FROMJS, REQUEST_GAMES, JOIN_GAME_EVENT, LEAVE_GAME_EVENT, CHAT_EVENT} from '../common/EventConstants';

import {wsConnect, wsConnectFailure, wsConnectSuccess, wsDisconnected} from './modules/wsConnection';
import {login, loginSuccess, loginFailure} from './modules/auth';
import {joinGame, joinGameSuccess, joinGameFailure} from './modules/joinGame';
import {refreshGames, refreshGamesSuccess, refreshGamesFailure} from './modules/gameList';
import {addPointToDrawing, endPathInDrawing, sendAddPoint, sendEndPath} from '../common/modules/game';
/* eslint no-constant-condition: 0, no-console: 0*/ //TODO: Remove console statements

//Selectors
const getPathname = state => state.getIn(['router', 'location', 'pathname']);

function connect(){
  const host = window.location.host;
  const socket = io(host, {
    'reconnection': true,
    'reconnectionDelay': 1000,
    'reconnectionDelayMax': 5000,
    'reconnectionAttempts': 5
  });

  return new Promise((resolve, reject) => {
    socket.on('connect', () => resolve(socket));
    socket.on('connect_timeout', () => reject('timeout'));
    socket.on('reconnect_failed', () => reject('reconnect_failed'));
  }).then(socket => ({socket}), error => ({error}));
}

function handleLogin(loginAction, socket){
  return new Promise((resolve, reject) => {
    socket.emit('LOGIN', {name: loginAction.payload.name}, res => {
      let {err, playerId, games, players} = res;
      if(err){
        reject(err);
      }else if(games){
        resolve({playerId, players, games});
      }else{
        resolve({playerId, players});
      }
    });
  }).then(res => res, error => ({error}));
}

function* handleAuth(socket){
  let response;
  while(response === undefined || response.playerId === undefined){
    const loginAction = yield take(login);
    response = yield call(handleLogin, loginAction, socket);
    if(response.error){
      yield put(loginFailure(response.error));
    }
  }
  yield put(loginSuccess(response.playerId, fromJS(response.players), fromJS(response.games)));

  const pathname = yield select(getPathname);
  if(pathname.startsWith('/game/')){ //Automatically attempt to join game when navigating to /game/:gameid
    let gameId = pathname.substring(6);
    yield put(joinGame(gameId));
  }

  yield take('LOGOUT');
  console.log('Logout here');
}

function subscribe(socket){
  return eventChannel(emit => {
    socket.on(ACTION, actions => {
      actions.forEach(action => emit(action));
    });

    socket.on(ACTION_FROMJS, actions => {
      actions.forEach(action => {
        action.payload = fromJS(action.payload);
        emit(action);
      });
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      //update state
    });

    socket.on('reconnect_failed', () => {
      console.log('reconnect_failed');
      emit(END);
    });

    return () => {};
  });
}

function* readFromSocket(socket){
  const channel = yield call(subscribe, socket);
  while(true){
    let action = yield take(channel);
    yield put(action);
  }
}

function* handleRequestGames(socket){
  let promise = new Promise((resolve, reject) => {
    socket.emit(REQUEST_GAMES, {}, res => {
      if(res.err){
        reject('Error getting game list');
      }else{
        resolve(res.games);
      }
    });
  }).then(games => ({games}), error => ({error}));
  const {games, error} = yield promise;
  if(games){
    yield put(refreshGamesSuccess(fromJS(games)));
  }else{
    yield put(refreshGamesFailure(error));
  }
}

function* handleJoinGame(socket, action){
  let gameId = action.payload.gameId;
  let promise = new Promise((resolve, reject) => {
    socket.emit(JOIN_GAME_EVENT, {gameId}, res => {
      if(res.err){
        reject(res.err);
      }else{
        resolve(res.game);
      }
    });
  }).then(game => ({game}), error => ({error}));
  const {game, error} = yield promise;
  if(game){
    yield put(joinGameSuccess(fromJS(game)));
    const pathname = yield select(getPathname);
    const newPath = '/game/' + gameId;
    if(pathname !== newPath){
      yield put(push(newPath));
    }
  }else{
    console.log('Join error: ', error);
  }
}

function* handleLeaveGame(socket){
  socket.emit(LEAVE_GAME_EVENT);
  yield put(push('/'));
  yield put(refreshGames()); //Update list of games in the lobby
}

function* handleSendAddPoint(socket, action){
  socket.emit('ADD_POINT_TO_DRAWING', action.payload);
  yield put(addPointToDrawing(action.payload));
}

function* handleSendEndPath(socket){
  socket.emit('END_PATH_IN_DRAWING');
  yield put(endPathInDrawing());
}

function* watchStoreActions(socket){
  yield takeEvery(sendAddPoint, handleSendAddPoint, socket);
  yield takeEvery(sendEndPath, handleSendEndPath, socket);
  yield takeEvery('SEND_CHAT_MESSAGE', (socket, action) => {
    socket.emit(CHAT_EVENT, action.payload);
  }, socket);
  yield takeLatest(refreshGames, handleRequestGames, socket);
  yield takeLatest(joinGame, handleJoinGame, socket);
  yield takeLatest('LEAVE_GAME', handleLeaveGame, socket);
}

function* handleSocket(socket){
  yield race({
    t1: call(readFromSocket, socket),
    t2: call(watchStoreActions, socket),
    t3: call(handleAuth, socket)
  });
}

function* socketSaga() {
  while(true){
    try{
      yield take(wsConnect);
      const {socket, error} = yield call(connect);
      if(error){
        console.error(`Error, could not connect (${error})`);
        yield put(wsConnectFailure(error));
      }else if(socket){
        yield put(wsConnectSuccess());
        yield call(handleSocket, socket);
        yield put(wsDisconnected());
        socket.destroy();
      }

    }catch(e){
      console.log('Caught error: ', e);
    }finally{
      console.log('finally');
    }
  }
}

export default function* rootSaga(){
  yield all([
    socketSaga()
  ]);
}