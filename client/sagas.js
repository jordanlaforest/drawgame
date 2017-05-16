import {take, put, fork, call} from 'redux-saga/effects';
import {eventChannel, END} from 'redux-saga';

import io from 'socket.io-client';

import {ACTION, INIT_EVENT_LOBBY, REQUEST_GAMES} from '../common/EventConstants';

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
  }).then(socket => {socket}).catch(error => {error});
}

function subscribe(socket){
  return eventChannel(emit => {
    socket.on(ACTION, actions => {
      actions.forEach(action => emit(action));
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      emit(END);
    });

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

function* watchStoreActions(socket){
   yield takeEvery('*', handleStoreAction, socket);
}

function* handleSocket(socket){
  yield fork(readFromSocket, socket);
  yield fork(watchStoreActions, socket);
}

function* socketSaga() {
  while(true){
    try{
      const {socket, error} = yield call(connect);
      if(error){
        console.err(`Error, could not connect (${error})`);
      }else if(socket){
        yield call(handleSocket, socket);
        socket.destroy();
      }

    }catch(e){
      console.log('Caught error: ', e);
    }finally{
      console.log('finally');
    }
    const action = yield take('RETRY_CONNECT');
  }
}

export default function* rootSaga(){
  yield [
    socketSaga()
  ];
}