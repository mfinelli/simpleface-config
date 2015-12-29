'use strict';

var gulp = require('gulp');
var gzip = require('gulp-gzip');
var html = require('gulp-htmlmin');
var jade = require('gulp-jade');

gulp.task('copy:css', function() {
  return gulp.src('./bower_components/Slate/dist/css/**/*.min.css')
            .pipe(gulp.dest('./css'));
});

gulp.task('gzip:css', ['copy:css'], function() {
  return gulp.src('./css/**/*.css')
            .pipe(gzip({ level: 9 }))
            .pipe(gulp.dest('./css'));
});

gulp.task('copy:js', function() {
  return gulp.src('./bower_components/Slate/dist/js/**/*.min.js')
            .pipe(gulp.dest('./js'));
});

gulp.task('gzip:js', ['copy:js'], function() {
  return gulp.src('./js/**/*.js')
            .pipe(gzip({ level: 9 }))
            .pipe(gulp.dest('./js'));
});

gulp.task('copy:fonts', function() {
  return gulp.src('./bower_components/Slate/dist/fonts/**/*.woff')
            .pipe(gulp.dest('./fonts'));
});

gulp.task('jade', function() {
  return gulp.src('./**/*.jade')
            .pipe(jade())
            .pipe(gulp.dest('./web'));
});

gulp.task('minify:html', function() {
  return gulp.src('./index.html')
            .pipe(html({
                 removeComments: true,
                 collapseWhitespace: true,
                 collapseBooleanAttributes: true,
                 // lint: true,
                 minifyCSS: {
                    keepSpecialComments: 0
                },
                minifyJS: true
            }))
            .pipe(gulp.dest('./'));
});

gulp.task('gzip:html', ['minify:html'], function() {
  return gulp.src('./index.html')
            .pipe(gzip({ level: 9 }))
            .pipe(gulp.dest('./'));
});

gulp.task('default', ['gzip:css', 'gzip:js', 'copy:fonts', 'gzip:html']);
