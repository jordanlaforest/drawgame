import React from 'react';
window.React = React;

import { Routes } from './router.jsx';
import Router from 'react-router';

import MainApp from './MainApp';
import { Flux } from 'flummox';

let { env: { NODE_ENV }} = process;
let flux = new MainApp(NODE_ENV);

/*eslint-disable no-proto */
// hack since proto's are broken for some reason in babel...
flux.__proto__ = Flux.prototype;
/*eslint-enable no-proto */

Router.run(Routes, (Handler) => {
  React.withContext(
    { flux },
    () => React.render(<Handler />, document.getElementById('react-view'))
  );
});
