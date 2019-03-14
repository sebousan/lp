// gulp
var gulp = require('gulp');

// config project
var config = require('./config.json');

// browser
var bs = require('browser-sync').create();

// assets
var autoprefixer = require('gulp-autoprefixer'); // autoprefixer for css
var browserify = require('gulp-browserify');
var cleanCSS = require('gulp-clean-css'); // css uglify
var image = require('gulp-image'); // image compression
var plumber = require('gulp-plumber');
var rename = require('gulp-rename'); // rename file for .min
var sourcemaps = require('gulp-sourcemaps');
var stylus = require('gulp-stylus'); // stylus
var uglify = require('gulp-uglify'); // js uglify

// for include some partials
var fileinclude = require('gulp-file-include');



/* *********
 ** TASKS **
********* */

// BROWSER SYNC
gulp.task("browser-sync", function () {
    'use strict';

    bs.init({
        server: config.dist
    });
});

// CSS
gulp.task("styles", function () {
    'use strict';

    return gulp
        .src(config.style_folder + '/' + config.style)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(autoprefixer(config.autoprefixer_options))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.dist_css))
        .pipe(rename(config.style_min))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.dist_css))
        .pipe(bs.reload({stream: true})); // reload browser
});

// JS
gulp.task('scripts', function () {
    'use strict';

    return gulp
        .src([config.js_folder + '/' + config.js])
        .pipe(sourcemaps.init())
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(plumber())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dist_js))
        .pipe(rename(config.js_min))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist_js))
        .pipe(bs.reload({stream: true})); // reload browser
});

// HTML
gulp.task('html', function () {
    'use strict';

    return gulp
        .src(config.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(config.dist))
        .pipe(bs.reload({stream: true})); // reload browser
});

// FONTS
gulp.task('fonts', function () {
    'use strict';

    return gulp
        .src(config.font_folder + '/**/*')
        .pipe(gulp.dest(config.dist_font))
        .pipe(bs.reload({stream: true})); // reload browser
});

// SVG
gulp.task('svg', function () {
    'use strict';

    return gulp
        .src(config.svg_folder + '/**/*')
        .pipe(image())
        .pipe(gulp.dest(config.dist_svg))
        .pipe(bs.reload({stream: true})); // reload browser
});

// IMAGES
gulp.task('images', function () {
    'use strict';

    return gulp
        .src(config.img_folder + '/**/*')
        .pipe(image(config.image_options))
        .pipe(gulp.dest(config.dist_img))
        .pipe(bs.reload({stream: true})); // reload browser
});


// WATCH
gulp.task("watch", ["browser-sync"], function () {
    'use strict';

    gulp.watch([config.partial_folder + '/**/*.' + config.partial_ext], ['html']);
    gulp.watch([config.style_folder + '/**/*.' + config.style_ext], ['styles']);
    gulp.watch([config.js_folder + '/**/*.' + config.js_ext], ['scripts']);
});

// INIT
gulp.task("default", ['styles', 'scripts', 'html', 'fonts', 'images']);
