var gulp = require('gulp')
var plumber = require('gulp-plumber')
var sourcemaps = require('gulp-sourcemaps')
var sass = require('gulp-sass')(require('sass'))
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var uncss = require('gulp-uncss')
var concatCss = require('gulp-concat-css')

var paths = {
  scss: { source: 'assets/css/dev/*.scss', target: 'assets/css/prod/' },
  js: { source: 'assets/js/dev/*.js', target: 'assets/js/prod/' }
}

function scss() {
  return gulp.src(paths.scss.source)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.target))
}

function js() {
  return gulp.src(paths.js.source)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.js.target))
}

function cssConcat() {
  return gulp.src([
    './assets/css/prod/icomoon.min.css',
    './assets/css/prod/mixins.min.css',
    './assets/css/prod/prism.min.css',
    './assets/css/prod/reset.min.css',
    './assets/css/prod/style.min.css',
    './assets/css/prod/variables.min.css'
  ])
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest('./assets/css/prod/'))
}

function uncssTask() {
  return gulp.src([
    './assets/css/prod/style.min.css'
  ])
    .pipe(uncss({
      html: ['./_site/index.html', './_site/**/*.html']
    }))
    .pipe(gulp.dest('./_includes/css'))
}

function watchFiles() {
  gulp.watch(paths.scss.source, scss)
  gulp.watch(paths.js.source, js)
}

gulp.task('scss', scss)
gulp.task('js', js)
gulp.task('cssConcat', cssConcat)
gulp.task('uncss', uncssTask)
gulp.task('css', gulp.series(cssConcat, uncssTask))
gulp.task('watch', watchFiles)
gulp.task('default', gulp.series(gulp.parallel(scss, js), watchFiles))
