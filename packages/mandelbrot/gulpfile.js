'use strict';

const gulp              = require('gulp');
const sass              = require('gulp-sass');
const sourcemaps        = require('gulp-sourcemaps');
const autoprefixer      = require('gulp-autoprefixer');
const sassGlob          = require('gulp-sass-glob');
const stylelint         = require('gulp-stylelint');
const uglify            = require('gulp-uglify');
const browserify        = require('browserify');
const watchify          = require('watchify');
const babel             = require('babelify');
const source            = require('vinyl-source-stream');
const buffer            = require('vinyl-buffer');
const del               = require('del');

//
// JS
//
gulp.task('js', ['clean:js'], () => compileJS());
gulp.task('js:watch', () => compileJS(true));

gulp.task('clean:js', function() {
    return del(['./dist/js']);
});

//
// CSS
//
gulp.task('css:skins', function() {
    const fs = require('fs');
    const skins = require('./assets/scss/skins/_skins.json');

    for (let skin of skins) {
        fs.writeFile(`./assets/scss/skins/${skin.name}.scss`,
`
$color-header-background: ${skin.accent};
$color-header-content: ${skin.complement};
$color-link: ${skin.links};

@import "../theme";
@import "../core/all";
@import "../components/**/*.scss";
`);
    }
});

gulp.task('css', ['css:skins'], function() {
  return gulp.src('./assets/scss/skins/*.scss')
    .pipe(stylelint({
        reporters: [{formatter: 'string', console: true}]
    }))
    .pipe(sassGlob())
    .pipe(sass({
        includePaths: 'node_modules'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 5 versions']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('css:clean', function() {
    return del(['./dist/css']);
});

gulp.task('css:watch', function () {
    gulp.watch('./assets/scss/**/*.scss', ['css']);
});

//
// Fonts
//
gulp.task('fonts', ['fonts:clean'], function() {
   gulp.src('./assets/fonts/**/*').pipe(gulp.dest('./dist/fonts'));
});

gulp.task('fonts:clean', function() {
    return del(['./dist/fonts']);
});

gulp.task('fonts:watch', function () {
    gulp.watch('./assets/fonts/**/*', ['fonts']);
});

//
// Images
//
gulp.task('img', ['img:clean'], function() {
   gulp.src('./assets/img/**/*').pipe(gulp.dest('./dist/img'));
   gulp.src('./assets/favicon.ico').pipe(gulp.dest('./dist'));
});

gulp.task('img:clean', function() {
    return del(['./dist/img']);
});

gulp.task('img:watch', function () {
    gulp.watch('./assets/img/**/*', ['img']);
});

//
// Task sets
//
gulp.task('watch', ['css:watch', 'js:watch', 'img:watch']);

gulp.task('default', ['fonts', 'css', 'js', 'img']);

//
// Utils
//
function compileJS(watch) {

    let bundler = browserify('./assets/js/mandelbrot.js', {
        debug: true
    }).transform(babel, {
        presets: ["es2015"]
    });

    if (watch) {
        bundler = watchify(bundler);
        bundler.on('update', function () {
            console.log('Rebundling JS....');
            rebundle();
        });
    }

    function rebundle() {
        let bundle = bundler.bundle()
            .on('error', function (err) {
                console.error(err.message);
                // this.emit('end');
            })
            .pipe(source('mandelbrot.js'))
            .pipe(buffer());

        if (!watch) {
            bundle.pipe(uglify());
        }

        bundle.pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js'));

        return bundle;
    }

    rebundle();
}
