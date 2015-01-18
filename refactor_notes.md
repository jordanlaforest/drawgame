# ES6 with 6to5 and Moonboots (Browserify Server)
6to5 compiles import statements into require statements.

Read [https://6to5.org/docs/tour/](6to5's tour of ES6). This gives you detailed descriptions of all the new ES6 features.
Read [http://6to5.org/docs/usage/modules/](6to5's import syntax).

On client side, browserify uses the require statements and generates a single bundle file that includes all those files (there are options to generate multiple bundles though). Your index would include the single bundle and the app works fine.

On the server side, 6to5 overrides nodes require algorithm to precompile the es6 modules down to es5, then hands node the generated ES5. I highly recommend that you look at the generated source and ask questions.

On the server side, when your index requests the bundled file, moonboots will either (re)generate the bundle or use the bundle it has cached. Moonboots provides some helper functions to generate the javascript source, express actually calls this when you try to request the source. Look in `server/WebServer.js` (renamed `web.js` to this) to see this.

# Server Side
I refactored `game.js` -> `server/GameServer.js`. The game server handles all the game logic, and attaches the websocket to the http server it gets passed. I also renamed `players.js` to `PlayerManager.js`. As a general rule of thumb, keep your classes simple and only manage a small amount of shared state.

# Common Code
`common/Player.js` currently is a simple empty class. `common/EventConstants.js` currently just contains strings.

# Client Side
Currently, the biggest change is that I removed the script tags in index.html, and import them in the bottom of `app.js` now. The reason for this is just due to angular complaining that the main module is not created yet, and that we need them to be imported to get the app working.

# Dumping angular in favour of react
I have had a much better experience with react, but it has an initial setup hurdle time. However, we can dump bower entirely and switch entirely to npm. I am not a big fan of having both client side node modules and server side node_modules, but we can have package.json in both `server` and `client`.
