'use strict';

const gulp         = require('gulp');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const source       = require('vinyl-source-stream');
const buffer       = require('vinyl-buffer');
const browserify   = require('browserify');
const watchify     = require('watchify');
const babel        = require('babelify');
const autoprefixer = require('gulp-autoprefixer');
const sassGlob     = require('gulp-sass-glob');
const del          = require('del');

function compileJS(watch) {

    var bundler = watchify(
        browserify('./assets/js/build.js', { debug: true }).transform(babel, {
            presets: ["es2015"]
        })
    );

    function rebundle() {
        return bundler
            .bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js'));
    }

    if (watch) {
        bundler.on('update', function () {
            rebundle();
        });
        rebundle()
    } else {
        rebundle();
    }
}

gulp.task('js', ['clean'], () => compileJS());
gulp.task('js:watch', () => compileJS(true));

gulp.task('clean', function() {
    return del(['./dist']);
});

gulp.task('css', ['clean'], function() {
  return gulp.src('./assets/scss/build.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 5 versions'],
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/fractal.css'));
});

gulp.task('css:watch', function () {
    gulp.watch('./assets/scss/**/*.scss', ['css']);
});

gulp.task('watch', ['css:watch', 'js:watch']);

gulp.task('default', ['css', 'js', 'watch']);
