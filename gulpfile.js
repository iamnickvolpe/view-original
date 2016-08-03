require('dotenv').config({silent: true});
var gulp = require('gulp');
var browserify = require('browserify');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var livereload = require('gulp-livereload');
var connectLivereload = require('connect-livereload');
var ngConfig = require('gulp-ng-config');
var fs = require('fs');
var config = require('./firebase-config.js');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('html', function() {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist/'))
    .pipe(livereload());
});

gulp.task('images', function() {
  gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.svg'])
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
});

gulp.task('browserify', function () {
  var bundler = browserify('./src/main.js', { debug: false });
  return bundler
    .transform({
      global: true,
      mangle: true,
      comments: false,
      compress: {
          angular: true
      }
    }, 'uglifyify')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
})

gulp.task('sass', function() {
  gulp.src('src/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.svg'], ['images']);
  gulp.watch('src/**/*.js', ['browserify']);
  gulp.watch('src/**/*.scss', ['sass']);
});

gulp.task('ng-config', function() {
 fs.writeFileSync('./firebase-config.json',
      JSON.stringify(config));
  gulp.src('./firebase-config.json')
    .pipe(
      ngConfig('ngEnvVars', {
        createModule: true
      })
    )
    .pipe(gulp.dest('./src'))
});

gulp.task('dev', ['ng-config', 'html', 'images', 'browserify', 'sass', 'watch']);
gulp.task('build', ['ng-config', 'html', 'images', 'browserify', 'sass']);