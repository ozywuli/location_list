var gulp = require('gulp');
var del = require('del');
var preprocess = require('gulp-preprocess');

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var mmq = require('gulp-merge-media-queries');
var nanocss = require('gulp-cssnano');

var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');

var jsonminify = require('gulp-jsonminify');

var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var notify = require("gulp-notify");


gulp.task('clean', function() {
  return del('build');
});

gulp.task('html', ['css', 'js', 'data'], function() {
  return compileHTML();
});
gulp.task('css', function() {
  return compileCSS();
});
gulp.task('js', function() {
  return compileJS();
});
gulp.task('data', function() {
  return compileData();
});



function compileHTML() {
  var returnObj = gulp.src('dev/index.html')
    .pipe(preprocess())
    .on('error', watchTask ) // restart watch task on error
    .pipe(gulp.dest('build/'))
    .pipe(notify('Compiled!'));
}


function compileCSS() {
  return gulp.src('dev/assets/scss/main.scss')
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'expanded'
    }))
    .pipe( mmq({
        log: true
    }))
    .pipe(sourcemaps.write())
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

function compileData() {
  return gulp.src('dev/assets/data/features.geojson')
    .pipe(jsonminify())
    .pipe(gulp.dest('build/assets/data'))
}



// Watch

gulp.task('watch', ['html', 'css', 'js', 'data'], watchTask);
gulp.task('default', ['watch']);



function watchTask(error) {
    handleError(error);
    watchHTML();
    watchCSS();
    watchJS();
    watchData();
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
function watchData(error) {
  handleError(error);
  gulp.watch(['dev/assets/data/features.geojson'], ['html']);
}


function handleError(error) {
    var message = error;
    if (typeof error === 'function' ) { return; }
    if (typeof error === 'object' && error.hasOwnProperty('message')) { message = error.message; }
    if (message !== undefined) { console.log('Error: ' + message); }
}
