import React from 'react';
window.React = React;

import { Routes } from './router.jsx';
import Router from 'react-router';

import MainApp from './MainApp';
import { Flux } from 'flummox';

// hack since proto's are broken right now in babel...
let flux = new MainApp();
flux.__proto__ = Flux.prototype;

Router.run(Routes, Router.HistoryLocation, (Handler) => {
  React.withContext(
    { flux },
    () => React.render(<Handler />, document.getElementById('react-view'))
  );
});
