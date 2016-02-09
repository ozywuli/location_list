var defaultTasks = ['watch'];

var gulp = require('gulp');
var preprocess = require('gulp-preprocess');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var mmq = require('gulp-merge-media-queries');
var nanocss = require('gulp-cssnano');

var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');

var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var notify = require("gulp-notify");

gulp.task('html', ['css', 'js'], function() {
  return compileHTML();
});
gulp.task('css', function() {
  return compileCSS();
});
gulp.task('js', function() {
  return compileJS();
});



function compileHTML() {
  var returnObj = gulp.src('dev/index.html')
    .pipe(preprocess())
    .on('error', watchTask ) // restart watch task on error
    .pipe(gulp.dest('build/'));
}


function compileCSS() {
  return gulp.src('dev/assets/css/main.scss')
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sass({
        outputStyle: 'expanded'
    }))
    .pipe( mmq({
        log: true
    }))
    .pipe(gulp.dest('build/assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(nanocss())
    .pipe(gulp.dest('build/assets/css'))
}


function compileJS() {
  return gulp.src('dev/assets/js/main.js')
    .pipe(eslint({
    'rules':{
        'quotes': [1, 'single'],
        'semi': [1, 'always']
    }
  }))
    .pipe(eslint.format())
    .pipe(eslint.result(function (result) {
        // Called for each ESLint result.
        console.log('ESLint result: ' + result.filePath);
        console.log('# Messages: ' + result.messages.length);
        console.log('# Warnings: ' + result.warningCount);
        console.log('# Errors: ' + result.errorCount);
    }))
    .pipe(gulp.dest('build/assets/js/'))
}



// Watch

gulp.task('watch', ['html', 'css', 'js'], watchTask);
gulp.task('default', defaultTasks);

function watchTask(error) {
    handleError(error);
    watchHTML();
    watchCSS();
    watchJS();
}


function watchHTML(error) {
    handleError(error);
    gulp.watch(['dev/index.html'], ['html']);
}

function watchCSS(error) {
    handleError(error);
    gulp.watch(['dev/assets/scss/*.scss'], ['html']);
}

function watchJS(error) {
    handleError(error);
    gulp.watch(['dev/assets/js/main.js'], ['html']);
}


function handleError(error) {
    var message = error;
    if (typeof error === 'function' ) return;
    if (typeof error === 'object' && error.hasOwnProperty('message')) message = error.message;
    if (message !== undefined) console.log('Error: ' + message);
}
