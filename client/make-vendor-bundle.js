var browserify = require('browserify');
var fs = require('fs');
var deps = require('./common/deps');

var b = browserify({ debug: false });

// make each dependency requireable
deps.forEach(function(lib) {
  // we can't just pass b.require as the function here because
  // forEach passes index as the second element...
  b.require(lib);
});

b
  .bundle()
  .pipe(fs.createWriteStream('bundle-vendor.js'));
