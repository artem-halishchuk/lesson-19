const { series, src, dest, watch, parallel } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssNano = require('cssnano');
const browserSync = require('browser-sync').create();
const autoPrefixer = require('autoprefixer');
const cssTrashKiller = require('postcss-trash-killer');


const browserTask = () => browserSync.init({
    server: {
        baseDir: './src'
    }
})

const watcher = () => {
    watch('./src/scss/**/*.scss', sassTask);
    watch('./src/*.html').on('change', browserSync.reload);
}


const sassTask = () =>
    src('./src/scss/styles.scss')
        .pipe(sass())
        .pipe(postcss
            (
                [
                    cssNano(),
                    autoPrefixer(),
                    cssTrashKiller(
                        {
                            tagSelectors: false, // default true, include all simple tag selectors(html, body, *, h1, but not `.className h1`
                            fileExtensions: ['.haml', '.html'], // File types for scanning selectors
                            paths: ['src/'], // Paths with your view files
                            whitelist: ['dontTouchSelector'], // not removable selectors
                            dynamicSelectors: ['theme-color'] // If you use dynamic selectors, insert here part of selector. Not removed all selectors if contains 'theme-color' part
                        }
                    )
                ]
            )
        )

        .pipe(dest('./src/css'))
        .pipe(browserSync.stream());

exports.default = series(sassTask, parallel(browserTask, watcher));


