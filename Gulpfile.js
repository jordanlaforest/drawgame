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
  del = require('del'),
  karma = require('karma').server;

/**
 * Local variables
 */
var paths = {
  scripts: ['app/scripts/{,*/}*.js'],
  styles: ['app/styles/*.scss'],
  views: ['app/views/*.html'],
  server: 'server/server.js',

  prodDir: 'dist/',
  devDir: '.tmp/'
};
var PORT = 9000,
  LR_PORT = 32756;
var lr;

/**
 * The clean task
 */
gulp.task('clean', function(done) {
  del.sync([paths.devDir, paths.prodDir]);
  done();
});

/**
 * Development server tasks
 *
 * livereload:    starts the livereload server
 * watch:         watches files and restarts the server
 *                also processes index.html when it changes
 * serve:         runs a local static file server, so we can test on a server
 */
gulp.task('livereload', function() {
  lr = tinylr();
  //default port
  lr.listen(LR_PORT, function() {
    g.util.log('Live-reload server started on port', g.util.colors.cyan(LR_PORT));
  });
});

// COPY PASTED FROM SOMEWHERE hehe
// Notifies livereload of changes detected
// by `gulp.watch()`
function notifyLivereload(event) {

  if(event === null) {
    return;
  }

  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(__dirname, event.path);

  lr.changed({
    body: {
      files: [fileName]
    }
  });

  //pretty print a message for the file changing
  g.util.log(g.util.colors.magenta(fileName), 'changed');
}

/**
 * Watches files and reloads the webpage
 * requires the livereload server be started first
 */
gulp.task('watch', ['livereload'], function(done) {
  gulp.watch([paths.scripts, paths.views, paths.devDir + '*.*'],
    notifyLivereload);

  gulp.watch(paths.styles, function(file) {
    gulp.start('sass')
      .on('task_end', function() {
        notifyLivereload(file);
      });
  });

  //this will update devDir index.html, and the previous trigger will occur
  gulp.watch('app/index.html', function(file) {
    gulp.start('index')
      .on('task_end', function() {
        notifyLivereload(file);
      });
  });

  //ensure we can run watch synchronously
  done();
});

// Runs a local static file server
gulp.task('serve', ['clean', 'watch', 'index'], function() {
  //the order of serving matters, index.html will be found in paths.devDir
  //first before searching in the app folder, index.html in the app folder
  //doesn't work on its own
  express()

  //injects the livereload script into your pages
  .use(require('connect-livereload')({
    port: LR_PORT
  }))

  //serve the .tmp directory
  .use(express.static(paths.devDir))

  //serve the root directory
  .use(express.static('.'))

  //serve the app directory (for view manipulation)
  .use(express.static('app/'))

  .listen(PORT, function() {
    // pretty print a message as if it were from gulp (with a time prefix)
    g.util.log('Listening on port', g.util.colors.cyan(PORT));
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

gulp.task('index:dist', ['sass:dist'], function() {
  return gulp.src('app/index.html')
    .pipe(g.inject(
      gulp.src(mainBowerFiles(), {
        read: false
      }), {
        starttag: '<!-- inject:bower:{{ext}} -->',
        addRootSlash: false //remove the slash in front of /bower_components
      }
    )) //use bower components locally
    //replace with as many cdn links as possible
    .pipe(g.googleCdn(require('./bower.json')))
    .pipe(g.googleCdn(require('./bower.json'), {
      cdn: require('cdnjs-cdn-data')
    }))
    .pipe(g.inject(
      gulp.src(
        paths.scripts.concat(
          [paths.prodDir + '*.css']
        ), {
          read: false
        }
      ), {
        starttag: '<!-- inject:app:{{ext}} -->',
        addRootSlash: false,
        ignorePath: [paths.prodDir]
      }
    )) //app
    .pipe(gulp.dest(paths.prodDir));
});


//the return means we can use sass synchronously
//we need to clean before running sass and index for example
//instead of sometimes after sometimes before
gulp.task('sass', function() {
  return gulp.src(paths.styles)
    .pipe(g.sass())
    .pipe(gulp.dest(paths.devDir));
});

//gulp-sass is different from gulp-ruby-sass
//gulp sass is faster, but isn't official
gulp.task('sass:dist', function() {
  return gulp.src(paths.styles)
    .pipe(g.sass())
    .pipe(gulp.dest(paths.prodDir + 'css/'));
});

// inject files into the karma file
gulp.task('karmaconf', function() {
  return gulp.src('test/karma.conf.js')
    .pipe(g.inject(
      gulp.src(mainBowerFiles(), {
        read: false
      }), {
        starttag: '// inject:bower:{{ext}}',
        endtag: '// endinject',
        addRootSlash: false,
        transform: function(filepath) {
          return '\'' + filepath + '\',';
        }
      }
    ))
    .pipe(gulp.dest(paths.devDir));
});

gulp.task('karma', ['karmaconf'], function() {
  var conf = require('./' + paths.devDir + 'karma.conf.js');
  karma.start(conf);
});

gulp.task('test', ['karma']);

// sourcemaps let us view the original source in production
// so we can debug problems
gulp.task('scripts:dist', function() {
  return gulp.src(paths.scripts)
    .pipe(g.sourcemaps.init())
    .pipe(g.ngAnnotate()) //annotate functions with ['$scope', ..] so uglify doesn't break everything
    .pipe(g.concat('app-built.js')) //merge files into one file with the name 'app-built.js'
    .pipe(g.uglify()) //obfuscate code to smaller variable names to save space
    .pipe(g.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.prodDir + 'js/'));
});

gulp.task('jshint', function() {
  return gulp.src(paths.scripts)
    .pipe(g.jshint())
    .pipe(g.jshint.reporter('jshint-stylish'));
});
