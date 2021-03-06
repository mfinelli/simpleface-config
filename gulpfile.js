'use strict';

var gulp = require('gulp');
var gzip = require('gulp-gzip');
var html = require('gulp-htmlmin');
var jade = require('gulp-jade');
var nano = require('gulp-minify-css');
var sass = require('gulp-sass');
var sort = require('gulp-sort');

var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var del = require('del');
var uglify = require('gulp-uglify');
var vinyl = require('vinyl-paths');
var shell = require('gulp-shell');
var favicon = require('gulp-real-favicon');
var optipng = require('imagemin-optipng');
var svgo = require('imagemin-svgo');

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
            .pipe(sort({ asc: false }))
            .pipe(vinyl(del))
            .pipe(concat('scripts.js'))
            .pipe(gulp.dest('./web/js'));
});

gulp.task('minify:js', ['combine:js'], function() {
  return gulp.src('./web/js/**/*.js')
            .pipe(uglify({ mangle: false }))
            .pipe(gulp.dest('./web/js'));
});

gulp.task('gzip:js', ['minify:js'], function() {
  return gulp.src('./web/js/**/*.js')
            .pipe(gzip({ level: 9 }))
            .pipe(gulp.dest('./web/js'));
});

gulp.task('copy:fonts', function() {
  return gulp.src('./bower_components/Slate/dist/fonts/**/*.woff')
            .pipe(gulp.dest('./web/fonts'));
});

gulp.task('jade', function() {
  return gulp.src('./index.jade')
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

gulp.task('favicon:export', shell.task([
  'convert -flatten -background none favicon.xcf favicon.png'
]));

gulp.task('favicon:generate', ['favicon:export'], function(done) {
  favicon.generateFavicon({
    masterPicture: 'favicon.png',
    dest: './web',
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'noChange',
        appName: 'SimpleFace Configuration'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'whiteSilhouette',
        backgroundColor: '#da532c',
        onConflict: 'override',
        appName: 'SimpleFace Configuration'
      },
      androidChrome: {
        pictureAspect: 'shadow',
        themeColor: '#000000',
        manifest: {
          name: 'SimpleFace Configuration',
          startUrl: 'https://simpleface.watch',
          display: 'standalone',
          orientation: 'portrait',
          onConflict: 'override'
        }
      },
      safariPinnedTab: {
        pictureAspect: 'blackAndWhite',
        threshold: 50,
        themeColor: '#5bbad5'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: 'faviconData.json'
  }, function() {
    done();
  });
});

gulp.task('favicon:clean', ['favicon:generate'], function() {
  return del(['favicon.png', 'faviconData.json']);
});

gulp.task('favicon:optimize:png', ['favicon:generate'], function() {
  return gulp.src('./web/**/*.png')
            .pipe(optipng({ optimizationLevel: 3 })())
            .pipe(gulp.dest('./web'));
});

gulp.task('favicon:optimize:svg', ['favicon:generate'], function() {
  return gulp.src('./web/**/*.svg')
            .pipe(svgo()())
            .pipe(gulp.dest('./web'));
});

gulp.task('gzip:other', ['favicon:generate'], function() {
  return gulp.src(['./web/manifest.json', './web/browserconfig.xml'])
            .pipe(gzip({ level: 9 }))
            .pipe(gulp.dest('./web'));
});

gulp.task('favicon',
  ['favicon:clean', 'favicon:optimize:png', 'favicon:optimize:svg']
);

gulp.task('robots', function() {
  return gulp.src('./robots.txt')
            .pipe(gulp.dest('./web'));
});

gulp.task('clean', function() {
  return del(['./web']);
});

gulp.task('default',
  [
    'gzip:css',
    'gzip:js',
    'copy:fonts',
    'gzip:html',
    'favicon',
    'gzip:other',
    'robots'
  ]
);
