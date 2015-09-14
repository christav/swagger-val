'use strict';

var gulp = require('gulp');

var scripts = [
  './bower_components/jquery/dist/jquery.min.*',
  './bower_components/bootstrap/js/*'
];

var styles = [
  './bower_components/bootstrap/dist/css/*'
];

var fonts = [
  './bower_components/bootstrap/fonts/*.*'
];

gulp.task('build-scripts', function () {
  return gulp.src(scripts)
    .pipe(gulp.dest('./webroot/js/'));
});

gulp.task('build-css', function () {
  return gulp.src(styles)
    .pipe(gulp.dest('./webroot/css/'));
});

gulp.task('build-fonts', function () {
  return gulp.src(fonts)
    .pipe(gulp.dest('./webroot/fonts/'));
});

gulp.task('build', ['build-scripts', 'build-css', 'build-fonts'], function () {
});

gulp.task('default', ['build'], function () {
});
