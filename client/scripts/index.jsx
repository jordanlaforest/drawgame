import React from 'react';
window.React = React;

import Router from './router.jsx';

import Socket from './utils/Socket';
import PlayerActionCreators from './actions/PlayerActionCreators';
Socket.on('reconnect', () => {
  PlayerActionCreators.initPlayer();
});
