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
  forever = require('forever-monitor'),
  del = require('del'),
  karma = require('karma').server;

/**
 * Local variables
 */
var paths = {
  scripts: 'app/scripts/{,*/}*.js',
  styles: 'app/styles/*.scss',
  views: 'app/views/*.html',
  server: 'server/server.js',

  images: 'app/images/*',

  prodDir: 'dist/',
  devDir: '.tmp/'
};
var PORT = 9000,
  LR_PORT = 35729;

/**
 * The clean task
 */
gulp.task('clean', function(done) {
  del.sync([paths.devDir, paths.prodDir]);
  done();
});

/**
 * Watches files and reloads the webpage
 * requires the livereload server be started first
 */
gulp.task('watch', function(done) {
  g.livereload.listen(LR_PORT);

  gulp.watch(paths.views).on('change', g.livereload.changed);

  gulp.watch(paths.scripts, ['lint-app']).on('change', g.livereload.changed);
  gulp.watch('server/*.js', ['lint-server']);

  gulp.watch(paths.styles, ['sass']);

  gulp.watch('app/index.html', ['index']);

  //ensure we can run watch synchronously
  done();
});

// Runs a local static file server
gulp.task('serve', ['clean', 'watch', 'index'], function() {
  var child = new(forever.Monitor)(paths.server, {
    options: ['--dirs=' + paths.devDir + ',.,app', '--port=' + PORT, '--lrport=' + LR_PORT],
    watch: true,
    watchDirectory: 'server'
  });

  child.on('watch:restart', function(info) {
    g.util.log('Restarting script because ' + g.util.colors.magenta(info.file) + ' changed');
  });

  child.on('restart', function() {
    g.util.log('Forever restarting script for ' + g.util.colors.red(child.times) + ' time');
  });

  child.on('exit', function() {
    g.util.log(g.util.colors.red('Forever exiting with code'));
  });

  child.start();
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
    .pipe(gulp.dest(paths.devDir))
    .pipe(g.livereload({
      auto: false
    }));
});

var htmlminOpts = {
  removeComments: false,
  collapseWhitespace: true
};

gulp.task('index:dist', ['sass:dist', 'scripts:dist', 'views:dist'], function() {
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
        ['js/*.js', 'css/*.css'].map(function(filename) {
          return paths.prodDir + filename;
        }), {
          read: false
        }
      ), {
        starttag: '<!-- inject:app:{{ext}} -->',
        addRootSlash: false,
        ignorePath: [paths.prodDir]
      }
    )) //app
    .pipe(g.htmlmin(htmlminOpts))
    .pipe(gulp.dest(paths.prodDir));
});

gulp.task('views:dist', function() {
  return gulp.src(paths.views)
    .pipe(g.sourcemaps.init())
    .pipe(g.htmlmin(htmlminOpts))
    .pipe(g.ngHtml2js())
    .pipe(g.concat('views.js'))
    .pipe(g.uglify())
    .pipe(g.rev())
    .pipe(g.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.prodDir + 'js/'));
});

gulp.task('build', ['clean', 'index:dist', 'images:dist']);

gulp.task('images:dist', function() {
  return gulp.src(paths.images)
    .pipe(g.imagemin())
    .pipe(gulp.dest(paths.prodDir));
});

//the return means we can use sass synchronously
//we need to clean before running sass and index for example
//instead of sometimes after sometimes before
gulp.task('sass', function() {
  return gulp.src(paths.styles)
    .pipe(g.sass())
    .pipe(gulp.dest(paths.devDir))
    .pipe(g.livereload({
      auto: false
    }));
});

//gulp-sass is different from gulp-ruby-sass
//gulp sass is faster, but isn't official
gulp.task('sass:dist', function() {
  return gulp.src(paths.styles)
    .pipe(g.sass())
    .pipe(g.minifyCss())
    .pipe(g.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(g.concat('app.css'))
    .pipe(g.rev())
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
    .pipe(g.concat('app.js')) //merge files into one file with the name 'app-built.js'
    .pipe(g.uglify()) //obfuscate code to smaller variable names to save space
    .pipe(g.rev())
    .pipe(g.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.prodDir + 'js/'));
});

/**
 * Easy to merge these tasks
 */
gulp.task('lint-app', function() {
  return gulp.src(paths.scripts)
    .pipe(g.jshint())
    .pipe(g.jshint.reporter('jshint-stylish'));
});

gulp.task('lint-server', function() {
  return gulp.src('server/{,**/}*.js')
    .pipe(g.jshint())
    .pipe(g.jshint.reporter('jshint-stylish'));
});

gulp.task('lint', ['lint-app', 'lint-server']);
