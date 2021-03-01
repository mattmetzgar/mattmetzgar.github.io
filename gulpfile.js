var gulp = require('gulp')
var plumber = require('gulp-plumber')
var sourcemaps = require('gulp-sourcemaps')
var sass = require('gulp-sass')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var uncss = require('gulp-uncss')
var concatCss = require('gulp-concat-css')

var paths = {
  scss: { source: 'assets/css/dev/*.scss', target: 'assets/css/prod/' },
  js: { source: 'assets/js/dev/*.js', target: 'assets/js/prod/' }
}

gulp.task('scss', function () {
  gulp.src(paths.scss.source)
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed' }))
      .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.target))
})

gulp.task('js', function () {
  gulp.src(paths.js.source)
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.target))
})

gulp.task('cssConcat', function () {
  return gulp.src([
    './assets/css/prod/icomoon.min.css',
    './assets/css/prod/mixins.min.css',
    './assets/css/prod/prism.min.css',
    './assets/css/prod/reset.min.css',
    './assets/css/prod/style.min.css',
    './assets/css/prod/variables.min.css'
  ])
    .pipe(concatCss("bundle.css"))
    .pipe(gulp.dest('./assets/css/prod/'));
});

gulp.task('uncss', function () {
  return gulp.src([
      './assets/css/prod/style.min.css'
    ])
      .pipe(uncss({
          html: ['./_site/index.html', './_site/**/*.html', 'http://127.0.0.1:4000/']
      }))
      .pipe(gulp.dest('./_includes/css'));
});

gulp.task('watch', function () {
  gulp.watch(paths.scss.source, ['scss'])
  gulp.watch(paths.js.source, ['js'])
})

gulp.task('default', ['scss', 'js', 'watch'])
