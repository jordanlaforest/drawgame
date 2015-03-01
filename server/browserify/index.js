import browserify from 'browserify';
import envify from 'envify/custom';

import deps from '../../common/deps';
import glob from 'glob';
import path from 'path';

export function createBrowserify(environment) {
    const production = environment === 'production';
    // start up browserify
    let b = browserify({
      basedir: '../client',
      debug: !production,
      cache: {}, packageCache: {}, fullPaths: true //for watchifys
    });
    // add the main file
    b.add('../client/index.jsx');

    // tell browserify that all react/lib/*.js libraries are external
    deps.push(...glob.sync(path.resolve(__dirname, '../../client/node_modules/react/lib/*.js')));

    // tell browserify that each library is externally requireable
    deps.forEach((lib) => b.external(lib));

    // transform using 6to5
    // this is really stupid, you must have 6to5ify installed in client side
    // also need reactify to use marty js
    b.transform('6to5ify', {
      sourceMapRelative: '../client'
    });
    b.transform(envify({
      NODE_ENV: environment
    }));

    return b;
}
