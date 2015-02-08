[![Code Climate](https://codeclimate.com/github/jordanlaforest/drawgame/badges/gpa.svg)](https://codeclimate.com/github/jordanlaforest/drawgame)

# Other readmes
There are readmes in `client` and `server` folder. Read those

# Installing
run the following:

1. `cd client && npm install`
2. `cd server && npm install`

# Running

After installing, you only need to `cd server && npm start`. The server has a livereload server enabled with [tinylr](https://github.com/mklabs/tiny-lr) and [watchify](https://github.com/substack/watchify). Watchify cache makes the build soooo much faster than with beefy. Anyways, this all runs on top of the basic express app.

Important note: in development, the index.html page requests `bundle.js` which is what watchify actually builds. So, you must leave this file in index.html during development.
