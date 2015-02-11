var browserify = require('browserify');
var fs = require('fs');
var pkg = require('./package.json');

var b = browserify('./empty.js');

// make each dependency requireable
Object.keys(pkg.dependencies).forEach(function(lib) {
  // we can't just pass b.require as the function here because
  // forEach passes index as the second element...
  b.require(lib);
});

b
  .bundle()
  .pipe(fs.createWriteStream('bundle-vendor.js'));
