import io from 'socket.io-client';

export default class SocketWrapper {
  constructor(url = 'http://localhost:9000', options = {}) {
    this.url = url;
    this.options = options;

    this.socket = io(this.url, this.options);
    this.socket.on('uid', (uid) => localStorage.setItem('uid', uid));
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  off(event, callback = undefined) {
    if(typeof callback === 'function') {
      this.socket.removeListener(event, callback);
    } else {
      this.socket.removeAllListeners(event);
    }
  }

  emit(event, data, callback = undefined) {
    if('init' === event){ //Automatically add the uid during init
      data.uid = this.uid();
    }
    if(typeof callback === 'function') {
      this.socket.emit(event, data, callback);
    } else {
      this.socket.emit(event, data);
    }
  }

  uid() {
    let id = localStorage.getItem('uid');
    if(!id) {
      id = this.socket.io.engine.id;
      localStorage.setItem('uid', id);
    }
    return id;
  }
}
