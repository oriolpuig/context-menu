var gulp = require('gulp'),
    sass = require('gulp-sass'),
    server = require('gulp-server-livereload'),
    watch = require('gulp-watch'),
    clean = require('gulp-clean');

var config = {
    urls: {
        PUBLIC_DIR: './dist/',
        APP_DIR: './app/'
    }
};

/***
 *  Default
 */
gulp.task('default', ['watch']);

gulp.task('watch', function () {
    watch(config.urls.APP_DIR + 'sass/**/*.scss', batch(function (events, done) {
        gulp.start('default', done);
    }));
});

/***
 *  Dev server => Launch a dev server with livereload configuration
 */
gulp.task('dev', ['watch', 'sass'], function () {
    gulp.src('app')
        .pipe(server({
            livereload: {
                enable: true,
                filter: function (filename, cb) {
                    cb(!/\.(sa|le)ss$|node_modules/.test(filename));
                }
            },
            open: true
        }));
});

/***
 *  Prod server => Launch a prod server with cleaned code.
 */
gulp.task('prod', ['public'], function () {
    gulp.src(config.urls.PUBLIC_DIR)
        .pipe(server());
});

/***
 *  Style => SASS
 */
gulp.task('sass', function () {
    return gulp.src(config.urls.APP_DIR + 'sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.urls.APP_DIR + 'css'));
});

gulp.task('sass:watch', function () {
    gulp.watch(config.urls.APP_DIR + 'sass/**/*.scss', ['sass']);
});

/***
 * Watch => configure which files to watch and what tasks to use on file changes
 */
gulp.task('watch', function () {
    gulp.watch(config.urls.APP_DIR + 'sass/**/*.scss', ['sass']);
});

/***
 *  Clean => Task to clean dist folder.
 */
gulp.task('clean', function () {
    return gulp.src(config.urls.PUBLIC_DIR, { read: false })
        .pipe(clean());
});

/***
 *  Copy => Tasks to copy files to dist folder.
 */
gulp.task('copy-index-html', function () {
    gulp.src(config.urls.APP_DIR + 'index.html')
        .pipe(gulp.dest(config.urls.PUBLIC_DIR));
});

gulp.task('copy-css', ['sass'], function () {
    gulp.src(config.urls.APP_DIR + 'css/*.css')
        .pipe(gulp.dest(config.urls.PUBLIC_DIR + 'css/'));
});

gulp.task('copy-js', function () {
    gulp.src(config.urls.APP_DIR + 'js/*.js')
        .pipe(gulp.dest(config.urls.PUBLIC_DIR + 'js/'));
});

gulp.task('copy-prod', ['copy-index-html', 'copy-css', 'copy-js']);

gulp.task('public', ['copy-prod']);
