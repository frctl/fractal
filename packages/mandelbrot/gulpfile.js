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
const uglify       = require('gulp-uglify');
const del          = require('del');

// CSS

gulp.task('js', ['clean:js'], () => compileJS());
gulp.task('js:watch', () => compileJS(true));

gulp.task('clean:js', function() {
    return del(['./dist/js']);
});

// CSS

gulp.task('css', ['clean:css'], function() {
  return gulp.src('./assets/scss/build.scss')
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 5 versions'],
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('clean:css', function() {
    return del(['./dist/css']);
});

gulp.task('css:watch', function () {
    gulp.watch('./assets/scss/**/*.scss', ['css']);
});

// Fonts

gulp.task('fonts', ['clean:fonts'], function() {
    gulp.src([
        './node_modules/source-sans-pro/WOFF/OTF/*.woff',
        './node_modules/source-sans-pro/WOFF2/OTF/**.woff2',
        './assets/fonts/hack/woff/*.woff',
        './assets/fonts/hack/woff2/*.woff2'
    ]).pipe(gulp.dest('./dist/fonts'));
});

gulp.task('clean:fonts', function() {
    return del(['./dist/fonts']);
});

gulp.task('fonts:watch', function () {
    gulp.watch('./assets/fonts/**/*', ['fonts']);
});

// Images

gulp.task('img', ['clean:img'], function() {
   gulp.src('./assets/img/**/*').pipe(gulp.dest('./dist/img'));
});

gulp.task('clean:img', function() {
    return del(['./dist/img']);
});

gulp.task('img:watch', function () {
    gulp.watch('./assets/img/**/*', ['img']);
});

// Task sets

gulp.task('watch', ['css:watch', 'js:watch', /* 'fonts:watch', */ 'img:watch']);

gulp.task('default', ['fonts', 'css', 'js', 'img', 'watch']);


// Utils

function compileJS(watch) {

    var bundler = watchify(
        browserify('./assets/js/build.js', {
            debug: true
        }).transform(babel, {
            presets: ["es2015"]
        })
    );

    function rebundle() {
        return bundler
            .bundle()
            .on('error', function (err) {
                console.error(err.message);
                // this.emit('end');
            })
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(uglify())
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
