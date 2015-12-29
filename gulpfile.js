'use strict';

var gulp = require('gulp');
var gzip = require('gulp-gzip');
var html = require('gulp-htmlmin');
var jade = require('gulp-jade');
var nano = require('gulp-minify-css');
var sass = require('gulp-sass');

var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var del = require('del');
var vinyl = require('vinyl-paths');

gulp.task('copy:css', function() {
  return gulp.src('./bower_components/Slate/dist/css/**/*.min.css')
            .pipe(gulp.dest('./web/css'));
});

gulp.task('sass', function() {
  return gulp.src('./*.scss')
            .pipe(sass())
            .pipe(gulp.dest('./web/css'));
});

gulp.task('combine:css', ['copy:css', 'sass'], function() {
  return gulp.src('./web/css/**/*.css')
            .pipe(vinyl(del))
            .pipe(concat('default.css'))
            .pipe(gulp.dest('./web/css'));
});

gulp.task('minify:css', ['combine:css'], function() {
  return gulp.src('./web/css/**/*.css')
            .pipe(nano())
            .pipe(gulp.dest('./web/css'));
});

gulp.task('gzip:css', ['minify:css'], function() {
  return gulp.src('./web/css/**/*.css')
            .pipe(gzip({ level: 9 }))
            .pipe(gulp.dest('./web/css'));
});

gulp.task('coffee', function() {
  return gulp.src('./*.coffee')
            .pipe(coffee({ bare: true }))
            .pipe(gulp.dest('./web/js'));
});

gulp.task('copy:js', function() {
  return gulp.src('./bower_components/Slate/dist/js/**/*.min.js')
            .pipe(gulp.dest('./web/js'));
});

gulp.task('combine:js', ['copy:js', 'coffee'], function() {
  return gulp.src('./web/js/**/*.js')
            .pipe(vinyl(del))
            .pipe(concat('scripts.js'))
            .pipe(gulp.dest('./web/js'));
});

gulp.task('gzip:js', ['combine:js'], function() {
  return gulp.src('./web/js/**/*.js')
            .pipe(gzip({ level: 9 }))
            .pipe(gulp.dest('./web/js'));
});

gulp.task('copy:fonts', function() {
  return gulp.src('./bower_components/Slate/dist/fonts/**/*.woff')
            .pipe(gulp.dest('./web/fonts'));
});

gulp.task('jade', function() {
  return gulp.src('./*.jade')
            .pipe(jade())
            .pipe(gulp.dest('./web'));
});

gulp.task('minify:html', ['jade'], function() {
  return gulp.src('./web/**/*.html')
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
            .pipe(gulp.dest('./web/'));
});

gulp.task('gzip:html', ['minify:html'], function() {
  return gulp.src('./web/**/*.html')
            .pipe(gzip({ level: 9 }))
            .pipe(gulp.dest('./web'));
});

gulp.task('clean', function() {
  return del(['./web']);
});

gulp.task('default', ['gzip:css', 'gzip:js', 'copy:fonts', 'gzip:html']);
