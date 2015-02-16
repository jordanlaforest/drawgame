var pkg = require('../client/package');

module.exports = Object.keys(pkg.dependencies)
  .concat([
    'flummox/component',
    'flummox/mixin',
    'react/addons'
  ]);
