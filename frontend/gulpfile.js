const gulp = require('gulp'), // Gulp
    cleanCSS = require('gulp-clean-css'),
    sass = require('gulp-sass'), // SASS,
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'), // Add the desired vendor prefixes and remove unnecessary in SASS-files
    notify = require("gulp-notify"),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    gutil = require('gulp-util'),
    njkRender = require('gulp-nunjucks-render'),
    htmlbeautify = require('gulp-html-beautify');

const config = {
    srcDir: './app',
    sassPattern: 'scss/**/*.scss',
    jsPattern: 'js/custom.js',
    njkPattern: 'nunjucks/**/*.njk'
};

//
// Сборка стилей
//

gulp.task('sass', function () {
    return gulp.src('./app/scss/custom.scss')
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(gulp.dest('./app/css/'))
});


gulp.task('css', ['sass'], function () {
    return gulp.src([
        './app/plugins/bootstrap/css/bootstrap.min.css',
        './app/plugins/slider.revolution/css/extralayers.css',
        './app/plugins/slider.revolution/css/settings.css',
        './app/css/essentials.css',
        './app/css/layout.css',
        './app/css/header-1.css',
        './app/css/color_scheme/yellow.css',
        './app/css/custom.css'
    ])
        .pipe(concat('bundle.min.css'))
        .pipe(gutil.env.type === 'production' ? cleanCSS({level: {1: {specialComments: 0}}}) : gutil.noop())
        .pipe(gulp.dest('./app/css'))
        .pipe(browserSync.reload({stream: true}));
});


//
// Сборка JS
//

gulp.task('js', function () {
    return gulp.src([
        './app/plugins/jquery/jquery-3.3.1.min.js',
        './app/js/scripts.js',
        './app/plugins/slider.revolution/js/jquery.themepunch.tools.min.js',
        './app/plugins/slider.revolution/js/jquery.themepunch.revolution.min.js',
        './app/js/view/demo.revolution_slider.js',
        './app/js/custom.js'
    ])
        .pipe(concat('bundle.min.js'))
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(gulp.dest('./app/js'))
        .pipe(browserSync.reload({stream: true}));
});


//
// Images
//

gulp.task('imagemin', function () {
    return gulp.src('./app/images/**/*')
        .pipe(cache(imagemin())) // Cache Images
        .pipe(gulp.dest('./dist/images'));
});


//
// Nunjucks
//

gulp.task('nunjucks', function () {
    return gulp.src([
        './app/nunjucks/pages/home/index.njk'
    ])
        .pipe(njkRender())
        .pipe(htmlbeautify({
            indent_size : 4 // размер отступа - 4 пробела
        }))
        .pipe(gulp.dest('./app'))
        .pipe(browserSync.reload({stream: true}));
});


//
// Browser Sync
//

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
        // tunnel: true,
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    });
});



gulp.task('watch', function () {
    gulp.watch(config.srcDir+'/'+config.sassPattern, ['css']);
    gulp.watch(config.srcDir+'/'+config.jsPattern, ['js']);
    gulp.watch(config.srcDir+'/'+config.njkPattern, ['nunjucks']);
});

gulp.task('default', ['css', 'js', 'nunjucks', 'browser-sync', 'watch']);