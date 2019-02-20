// gulp
var gulp = require('gulp');

// config project
var config = require('./config.json');

// browser
var bs = require('browser-sync').create();

// assets
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var stylus = require('gulp-stylus');

// for include some partials
var fileinclude = require('gulp-file-include');



/* *********
 ** TASKS **
********* */

// BROWSER SYNC
gulp.task("browser-sync", function() {
    bs.init({
        server: config.dist
    });
});

// CSS
gulp.task("styles", function() {
    return gulp
        .src([config.style_folder + config.style])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(
            stylus({
                compress: true
            })
        )
        .pipe(autoprefixer(config.autoprefixer_options))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dist_css))
        .pipe(bs.reload({ stream: true })) // reload browser
});

// JS
gulp.task('scripts', function () {
    return gulp
        .src([config.js_folder + config.js])
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dist_js))
        .pipe(bs.reload({ stream: true })); // reload browser
});

// HTML
gulp.task('html', function () {
    return gulp
        .src(config.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(config.dist))
        .pipe(bs.reload({ stream: true })); // reload browser
});

// FONTS
gulp.task('fonts', () => {
    return gulp
        .src(config.font_folder + '/**/*')
        .pipe(gulp.dest(config.dist_font))
        .pipe(bs.reload({ stream: true })); // reload browser
})

// WATCH
gulp.task("watch", ["browser-sync"], function() {
    gulp.watch([config.partial_folder + '/**/*.' + config.partial_ext], ['html'])
    gulp.watch([config.style_folder + '/**/*.' + config.style_ext], ['styles'])
    gulp.watch([config.js_folder + '/**/*.' + config.js_ext], ['scripts'])
});

// INIT
gulp.task("default", ['styles', 'scripts', 'html', 'fonts']);
