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
        .pipe(cleanCSS({ compatibility: 'ie10' }))
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


// 打包圖片  // 路徑  dev/images/*.*
const imagemin = require('gulp-imagemin');

function imgs_dev() {
    return src(['dev/images/*.*', 'dev/images/**/*.*'])
        .pipe(dest('dist/img'))
}

// 壓圖
function imgs_prod() {
    return src(['dev/images/*.*', 'dev/images/**/*.*'])
        .pipe(imagemin())  // 壓圖
        .pipe(dest('dist/images'))
}



const clean = require('gulp-clean');

function clear() {
    return src('dist', { read: false, allowEmpty: true })
        .pipe(clean({ force: true }));
}





// 同步瀏覽器
const browserSync = require('browser-sync');
const reload = browserSync.reload;


exports.default = function browser() {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });
    watch(['dev/*.html', 'dev/**/*.html'], includeHTML).on('change', reload);
    watch(['dev/sass/*.scss', 'dev/sass/**/*.scss'], sassStyle).on('change', reload);
    watch(['dev/images/*.*', 'dev/images/**/*.*'], imgs_dev).on('change', reload);
}




exports.prod = series(clear, parallel(includeHTML, sassStyle), imgs_prod);












