var gulp    = require('gulp'),
    jshint  = require('gulp-jshint'),
    sass    = require('gulp-sass'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglify'),
    nodemon = require('gulp-nodemon'),
    wiredep = require('wiredep');

var paths = {
  scripts: ['app/scripts/{,*/}*.js'],
  css: ['app/styles/*.scss'],
  server: 'server/server.js',
  dest: 'dist'
};

gulp.task('serve', function(){
  nodemon({script: paths.server});
});

gulp.task('wiredep', function(){
  gulp.src(paths.css)
     .pipe(wiredep({
       directory: 'bower_components',
       ignorePath: 'bower_components/'
     }));
     //.pipe("suff here")
});

gulp.task('test', function(){
  //TODO
});

gulp.task('concat', function(){
  gulp.src(paths.scripts)
     .pipe(concat('main.js'))
     .pipe(gulp.dest(paths.dest));
});

gulp.task('sass', function(){
  gulp.src(paths.css)
     .pipe(sass())
     .pipe(gulp.dest(paths.dest));
});

gulp.task('jshint', function(){
  gulp.src(paths.scripts)
     .pipe(jshint())
     .pipe(jshint.reporter('default'))
});
