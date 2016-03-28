var gulp        = require('gulp'),
    browserify  = require('gulp-browserify'),
    concat      = require('gulp-concat'),
    server      = require('gulp-express'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify');

gulp.task('concat', function() {
    return gulp.src([
            'scripts/**/*.js'
        ])
        .pipe(concat('app.js'))
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('compress', ['concat'], function() {
    return gulp.src('public/js/app.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('sass', function () {
    gulp.src('./styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('styles', ['sass']);
gulp.task('scripts', ['concat', 'compress']);

gulp.task('server', function () {

    server.run(['app.js']);
    
    gulp.run('styles', 'scripts');

    gulp.watch('./scripts/**/*.js', ['scripts']);
    gulp.watch('./styles/**/*.scss', ['sass']);

    gulp.watch(['app.js'], [server.run]);
});