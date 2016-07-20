'use strict';

var gulp = require('gulp'),
  debug = require('gulp-debug'),
  inject = require('gulp-inject'),
  less = require('gulp-less'),
  sourcemaps = require('gulp-sourcemaps'),
  del = require('del'),
  Config = require('./gulpfile.config'),
  browserSync = require('browser-sync'),
  runSequence = require('run-sequence'),
  uglify = require('gulp-uglify'),
  superstatic = require('superstatic');

var config = new Config();

gulp.task('copy-html', function () {
  return gulp.src([config.source + '/**/*.html', config.source + '/**/*.ico'])
    .pipe(gulp.dest(config.output));
});

gulp.task('copy-libs', function () {
  return gulp.src(['./node_modules/angular/angular.js', './node_modules/dateformat/lib/dateformat.js'])
    .pipe(gulp.dest(config.libOutputPath));
});

gulp.task('copy-js', function () {
  return gulp.src([config.source + '/**/*.js'])
    .pipe(gulp.dest(config.mainOutputPath));
});

gulp.task('copy-js-prod', function () {
  return gulp.src([config.source + '/**/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest(config.mainOutputPath));
});

gulp.task('less', function () {
  return gulp.src([config.source + '/**/*.less'])
    .pipe(less())
    .pipe(gulp.dest(config.mainOutputPath));
});


/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean', function (cb) {
  var typeScriptGenFiles = [
    config.mainOutputPath + '/**/*.js',    // path to all JS files auto gen'd by editor
    config.mainOutputPath + '/**/*.js.map', // path to all sourcemap files auto gen'd by editor
    '!' + config.mainOutputPath + '/lib'
  ];

  // delete the files
  return del(typeScriptGenFiles, cb);
});

gulp.task('build-all', function (done) {
  return runSequence('clean', 'copy-html', 'copy-libs', 'copy-js', 'less', done);
});

gulp.task('build-all-prod', function (done) {
  return runSequence('clean', 'copy-html', 'copy-libs', 'copy-js-prod', 'less', done);
});

gulp.task('watch', function () {
  gulp.watch([config.allJavaScript], ['copy-js']);
  gulp.watch([config.allLess], ['less']);
  return gulp.watch([config.source + '/**/*.html'], ['copy-html']);

});

gulp.task('serve', ['build-all', 'watch'], function () {
  process.stdout.write('Starting browserSync and superstatic...\n');
  browserSync({
    port: 3000,
    files: ['index.html', '**/*.js', '**/*.css'],
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'silent',
    logPrefix: 'angularintypescript',
    notify: true,
    reloadDelay: 0,
    server: {
      baseDir: config.output,
      middleware: superstatic({debug: true})
    }
  });
});

gulp.task('default', ['build-all']);