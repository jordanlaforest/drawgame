/**
 * gulp plugins
 */
'use strict';
var gulp = require('gulp'),
  g = require('gulp-load-plugins')();

/**
 * Npm plugins
 */
var mainBowerFiles = require('main-bower-files'),
  express = require('express'),
  tinylr = require('tiny-lr'),
  del = require('del');

/**
 * Local variables
 */
var paths = {
  scripts: ['app/scripts/{,*/}*.js'],
  styles: ['app/styles/*.scss'],
  server: 'server/server.js',

  prodDir: 'dist/',
  devDir: '.tmp/'
};
var PORT = 9000,
  LR_PORT = 32756;
var lr;

gulp.task('clean', function(done) {
  del.sync([paths.devDir, paths.prodDir]);
  done();
});

gulp.task('livereload', function() {
  lr = tinylr();
  //default port
  lr.listen(LR_PORT, function() {
    g.util.log('Live-reload server started on port', g.util.colors.cyan(LR_PORT));
  });
});

//COPY PASTED FROM SOMEWHERE hehe
// Notifies livereload of changes detected
// by `gulp.watch()`
function notifyLivereload(event) {

  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(__dirname, event.path);

  lr.changed({
    body: {
      files: [fileName]
    }
  });

  g.util.log(g.util.colors.magenta(fileName), 'changed');
}

gulp.task('watch', ['livereload'], function() {
  gulp.watch([paths.scripts, paths.styles, paths.devDir + '*.*'],
    notifyLivereload);

  gulp.watch('app/index.html', ['index', notifyLivereload]);
});

//run index and sass first
gulp.task('serve', ['watch', 'clean', 'index'], function() {
  //the order of serving matters, index.html will be found in paths.devDir
  //first before searching in the app folder
  express()

  //serve the .tmp directory
  .use(express.static(paths.devDir))

  //serve the root directory
  .use(express.static('.'))

  //serve the app directory (for views)
  .use(express.static('app/'))

  //injects the livereload script into your stuff
  .use(require('connect-livereload'))

  .listen(PORT, function() {
    //pretty print a message as if it were from gulp (with a time prefix)
    g.util.log('Listening on port', g.util.colors.cyan(PORT))
  });
  //TODO live reload with the API server.
  /*
  g.nodemon({
    script: paths.server
  });
*/
});

//NOTE if some of the bower files aren't being
//found correctly, look up main-bower-files on npm
//for options
gulp.task('index', ['sass'], function() {
  return gulp.src('app/index.html')
    .pipe(g.inject(
      gulp.src(mainBowerFiles(), {
        read: false
      }), {
        starttag: '<!-- inject:bower:{{ext}} -->',
        addRootSlash: false //remove the slash in front of /bower_components
      }
    )) //bower
    .pipe(g.inject(
      gulp.src(
        paths.scripts.concat(
          [paths.devDir + '*.css']
        ), {
          read: false
        }
      ), {
        starttag: '<!-- inject:app:{{ext}} -->',
        addRootSlash: false,
        ignorePath: [paths.devDir]
      }
    )) //app
    .pipe(gulp.dest(paths.devDir));
});

//the return means we can use sass synchronously
//we need to clean before running sass and index for example
//instead of sometimes after sometimes before
gulp.task('sass', function() {
  return gulp.src(paths.styles)
    .pipe(g.sass())
    .pipe(gulp.dest(paths.devDir));
});

gulp.task('sass:dist', function() {
  return gulp.src(paths.styles)
    .pipe(g.sass())
    .pipe(gulp.dest(paths.prodDir));
});

gulp.task('test', function() {
  //TODO
});

gulp.task('concat', function() {
  return gulp.src(paths.scripts)
    .pipe(g.concat('main.js'))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('jshint', function() {
  return gulp.src(paths.scripts)
    .pipe(g.jshint())
    .pipe(g.jshint.reporter('jshint-stylish'));
});
