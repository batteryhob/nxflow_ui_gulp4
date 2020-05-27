//essential
const { src, dest, watch, series, parallel } = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const ejs  = require('gulp-ejs');
const rename  = require('gulp-rename');
const connect   = require('gulp-connect');
const spritesmith = require('gulp.spritesmith');


//clean
async function clean(cb){
    await del('dist/**', { force:true });
    cb()
};


//task
function spriteTask(cb) {
    let spriteData = src('./src/images/*.png')
    .pipe(spritesmith({
        imgName: './sprite.png',
        cssName: 'sprite.css',
        padding: 4,        
    }));
    spriteData.img.pipe(dest('./dist/sprite'));
    spriteData.css.pipe(dest('./dist/sprite'));
    cb()
}


function sassTask() {
    return src('./src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./dist/css'))
    .pipe(connect.reload());
}


function ejsTask() {
    return src('./src/views/*.ejs')
    .pipe(ejs({ title: "nxflow" }))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest('./dist'))
    .pipe(connect.reload());
}


function connectServer() {
    connect.server({
        root: './dist',
        livereload: true,
        port: 8001
    });
}


function watchFile() {
    watch('./src/styles/**/*.scss', sassTask)
    watch('./src/views/*.ejs', ejsTask)
}

//task 순서
exports.default = parallel(
    series(clean, spriteTask, sassTask, ejsTask, connectServer),
    watchFile
);