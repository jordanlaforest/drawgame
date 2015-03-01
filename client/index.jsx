import React from 'react';
window.React = React;

import { Routes } from './router.jsx';
import Router from 'react-router';

import MainApp from './MainApp';
import { Flux } from 'flummox';

// hack since proto's are broken right now in babel...
let flux = new MainApp();
/*eslint-disable no-proto */
flux.__proto__ = Flux.prototype;
/*eslint-enable no-proto */

Router.run(Routes, (Handler) => {
  React.withContext(
    { flux },
    () => React.render(<Handler />, document.getElementById('react-view'))
  );
});
