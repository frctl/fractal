'use strict';

const { dest, parallel, series, src, watch } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const sassGlob = require('gulp-sass-glob');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const del = require('del');

//
// JS
//
function compileJs() {
    return bundleJs();
}

function cleanJs() {
    return del(['./dist/js']);
}

const js = series(cleanJs, compileJs);

exports.js = js;

//
// CSS
//
function createCssSkins(cb) {
    const fs = require('fs');
    const skins = require('./assets/scss/skins/_skins.json');

    for (let skin of skins) {
        fs.writeFileSync(
            `./assets/scss/skins/${skin.name}.scss`,
            `$color-header-background: ${skin.accent};
$color-header-content: ${skin.complement};
$color-link: ${skin.links};

@import "../theme";
@import "../core/all";
@import "../components/**/*.scss";
`
        );
    }

    cb();
}

function bundleCss(watch) {
    return src(['./assets/scss/skins/*.scss', './assets/scss/highlight.scss'])
        .pipe(sassGlob())
        .pipe(
            sass({
                includePaths: 'node_modules',
            }).on('error', sass.logError)
        )
        .pipe(autoprefixer())
        .pipe(gulpif(!watch, cleanCSS()))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./dist/css'));
}

function compileAndMinifyCss() {
    return bundleCss();
}

function compileCss() {
    return bundleCss(true);
}

const css = series(createCssSkins, compileAndMinifyCss);

exports.css = css;

//
// Fonts
//
function copyFonts() {
    return src('./assets/fonts/**/*').pipe(dest('./dist/fonts'));
}

function cleanFonts() {
    return del(['./dist/fonts']);
}

const fonts = series(cleanFonts, copyFonts);

exports.fonts = fonts;

//
// Images
//
function copyImg() {
    return src('./assets/img/**/*').pipe(dest('./dist/img'));
}

function copyFavicon() {
    return src('./assets/favicon.ico').pipe(dest('./dist'));
}

function cleanImg() {
    return del(['./dist/img']);
}

const img = series(cleanImg, parallel(copyImg, copyFavicon));

exports.img = img;

//
// Task sets
//
function watchFiles() {
    watch('./assets/scss/**/*.scss', compileCss);
    bundleJs(true);
    watch('./assets/img/**/*', img);
    watch('./assets/fonts/**/*', fonts);
}

const compile = series(css, js, img, fonts);

exports.watch = series(compile, watchFiles);

exports.default = compile;

//
// Utils
//
function bundleJs(watch) {
    let bundler = browserify('./assets/js/mandelbrot.js', {
        debug: true,
    }).transform(babel, {
        presets: ['es2015'],
    });

    if (watch) {
        bundler = watchify(bundler);
        bundler.on('update', function () {
            console.log('Rebundling JS....');
            rebundle();
        });
    }

    function rebundle() {
        let bundle = bundler
            .bundle()
            .on('error', function (err) {
                console.error(err.message);
                // this.emit('end');
            })
            .pipe(source('mandelbrot.js'))
            .pipe(buffer());

        if (!watch) {
            bundle.pipe(uglify());
        }

        bundle
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(dest('./dist/js'));

        return bundle;
    }

    return rebundle();
}
