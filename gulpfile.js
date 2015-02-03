// Load plugins
var gulp = require('gulp'),
    // sass = require('gulp-ruby-sass'),
    compass   = require('gulp-compass'),
    plumber   = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');
 
// Styles
gulp.task('styles', function() {
  return gulp.src('src/sass/*.scss')
    .pipe(plumber())
    .pipe(compass({
          config_file: './config.rb',
          css  : 'dist/css',
          sass : 'src/sass',
          image: 'dist/images'
        }))
      .on('error', function(err) {
          console.log(err);
      })
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'CSS OK' }));
});
 
// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'JS OK' }));
});
 
// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(plumber())
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'));
    // .pipe(notify({ message: 'IMG OK' }));
});
 
// Clean
gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js', 'dist/images'], cb)
});
 
// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('scripts', 'images', 'styles');
});
 
// Watch
gulp.task('watch', ['default'], function() {
 
  // Watch .scss files
  gulp.watch('src/sass/**/*.scss', ['styles']).on('change', function(e) {
    console.log('Le fichier '+ e.path + ' a ete modifie');
  });
 
  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']).on('change', function(e) {
    console.log('Le fichier '+ e.path + ' a ete modifie');
  });
 
  // Watch image files
  gulp.watch('src/images/**/*', ['images']).on('change', function(e) {
    console.log('Le fichier '+ e.path + ' a ete modifie');
  });
 
});