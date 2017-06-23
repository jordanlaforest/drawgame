import {take, put, fork, call, race} from 'redux-saga/effects';
import {eventChannel, END, takeEvery, takeLatest} from 'redux-saga';
import {fromJS} from 'immutable';

import io from 'socket.io-client';

import {ACTION, INIT_EVENT_LOBBY, REQUEST_GAMES} from '../common/EventConstants';
import {addPointToDrawing, ADD_POINT_TO_DRAWING,
        endPathInDrawing, END_PATH_IN_DRAWING,
        addChatMessage, ADD_CHAT_MESSAGE} from '../common/actions';

import {wsConnect, wsConnectFailure, wsConnectSuccess, wsDisconnected} from './modules/wsConnection';
import {login, loginSuccess, loginFailure} from './modules/auth';
import {refreshGames, refreshGamesSuccess, refreshGamesFailure} from './modules/gameList'

function connect(){
  console.log('Connecting to server...');
  const socket = io('http://localhost:9000', {
    'reconnection': true,
    'reconnectionDelay': 1000,
    'reconnectionDelayMax': 5000,
    'reconnectionAttempts': 5
  });

  return new Promise((resolve, reject) => {
    socket.on('connect', () => resolve(socket));
    socket.on('connect_timeout', () => reject('timeout'));
    socket.on('reconnect_failed', () => reject('reconnect_failed'))
  }).then(socket => ({socket}), error => ({error}));
}

function handleLogin(loginAction, socket){
  return new Promise((resolve, reject) => {
    socket.emit('LOGIN', {name: loginAction.payload.name}, res => {
      let {err, playerId, games, players} = res;
      if(err){
        reject(err);
      }else if(games){
        resolve({playerId, players, games})
      }else{
        resolve({playerId, players});
      }
    })
  }).then(res => res, error => ({error}));
}

function* handleAuth(socket){
  let response;
  while(response === undefined || response.playerId === undefined){
    const loginAction = yield take('LOGIN');
    response = yield call(handleLogin, loginAction, socket);
    if(response.error){
      yield put(loginFailure(response.error));
    }
  }
  yield put(loginSuccess(response.playerId, response.players, response.games));
  yield take('LOGOUT');
  console.log('Logout here');
}

function subscribe(socket){
  return eventChannel(emit => {
    socket.on(ACTION, actions => {
      actions.forEach(action => emit(action));
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      //update state
    });

    socket.on('reconnect_failed', () => {
      console.log('reconnect_failed');
      emit(END);
    })

    return () => {};
  });
}

function* readFromSocket(socket){
  const channel = yield call(subscribe, socket);
  while(true){
    const data = yield take(channel);
    console.log(data);
  }
}

function* handleRequestGames(socket, action){
  let promise = new Promise((resolve, reject) => {
    socket.emit(REQUEST_GAMES, {}, res => {
      if(res.err){
        reject('Error getting game list');
      }else{
        resolve(res.games);
      }
    })
  }).then(games => ({games}), error => ({error}));
  const {games, error} = yield promise;
  if(games){
    yield put(refreshGamesSuccess(fromJS(games)));
  }else{
    yield put(refreshGamesFailure(error));
  }
}

function* watchStoreActions(socket){
   yield takeEvery(ADD_POINT_TO_DRAWING, (socket, action) => console.log(action), socket);
   yield takeEvery(END_PATH_IN_DRAWING, (socket, action) => console.log(action), socket);
   yield takeEvery(ADD_CHAT_MESSAGE, (socket, action) => {
    socket.emit(CHAT_EVENT, action.message);
  }, socket);
   yield takeLatest('REFRESH_GAMES', handleRequestGames, socket);
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
      yield take('WS_CONNECT');
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
  yield [
    socketSaga()
  ];
}