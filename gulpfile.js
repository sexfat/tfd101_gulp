const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

// sass 編譯

const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');


function sassStyle() {
    return src('dev/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie10'})) 
        .pipe(dest('dist/css'));
};




// html template

const fileinclude = require('gulp-file-include');

function includeHTML() {
    return src('dev/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dist'));
}

const browserSync = require('browser-sync');
const reload = browserSync.reload;


exports.default =  function browser() {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });
    watch(['dev/*.html' , 'dev/**/*.html'], includeHTML).on('change' , reload);
    watch(['dev/sass/*.scss' ,'dev/sass/**/*.scss'] , sassStyle).on('change' , reload);
}


