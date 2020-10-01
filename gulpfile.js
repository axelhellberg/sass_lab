const { src, dest, series, parallel, watch } = require('gulp');

const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const imgMin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

sass.compiler = require('node-sass');

const files = { // object containing source file directories
    htmlPath: 'src/*.html',
    scssPath: 'src/scss/**/*.scss',
    jsPath: 'src/js/*.js',
    imgPath: 'src/img/*'
}

function copyHTML() {
    return src(files.htmlPath)
        .pipe(dest('pub')) // copy source html files to publishing folder
}

function cssTask() {
    return src(files.scssPath)
        .pipe(sass().on('error', sass.logError)) // convert sass to css and show error
        .pipe(concat('styles.css')) // concatenate css files
        .pipe(cleanCSS()) // minify css
        .pipe(dest('pub/css')) // send css file to publishing folder
        .pipe(browserSync.stream()) // inject css changes into browser
}

function jsTask() {
    return src(files.jsPath)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('main.js')) // concatenate all js files into main.js
        .pipe(terser()) // minify javascript
        .pipe(sourcemaps.write('.'))
        .pipe(dest('pub/js')) // send concatenated file to publishing js folder
}

function imgTask() {
    return src(files.imgPath)
        .pipe(imgMin()) // minify images
        .pipe(dest('pub/img')); // send images to publishing image folder
}

function serve() {
    browserSync.init({
        server: {
            baseDir: 'pub/' // serve files from pub folder
        },
    });
}

function watchTask() { // watch for changes in files, run tasks and reload browser
    watch(files.scssPath, cssTask);
    watch(files.htmlPath, copyHTML).on('change', browserSync.reload);
    watch(files.jsPath, jsTask).on('change', browserSync.reload);
    watch(files.imgPath, imgTask).on('change', browserSync.reload);
}

exports.default = series( // export tasks
    parallel(
        copyHTML,
        jsTask,
        cssTask,
        imgTask
    ),
    parallel(
        serve,
        watchTask
    )
);