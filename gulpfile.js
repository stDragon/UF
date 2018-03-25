var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    server = require('gulp-express'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify');

gulp.task('concatMain', ['concatUf'], function () {
    return gulp.src([
        'scripts/main.js'
    ])
        .pipe(concat('main.js'))
        .pipe(browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
        .pipe(gulp.dest('public/js'));
});

/* несжатый скрипт модуля*/
gulp.task('concatUf', function () {
    return gulp.src([
        'scripts/uf.js'
    ])
        .pipe(concat('uf.js'))
        .pipe(browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('compressMain', ['concatMain'], function () {
    return gulp.src(['scripts/main.js', 'public/js/main.js'])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('public/js'));
});

/* сжатый скрипт модуля */
gulp.task('compressUf', ['concatUf'], function () {
    return gulp.src(['public/js/uf.js'])
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

gulp.task('styles', function () {
    gulp.watch('./styles/**/*.scss', ['sass']);
    gulp.run('sass');
});

gulp.task('scripts', function () {
    gulp.watch('./scripts/**/*.js', ['scripts']);
    gulp.run('concatUf', 'compressUf', 'concatMain', 'compressMain');

});

gulp.task('server', function () {
    server.run(['app.js']);
    gulp.watch(['app.js', 'server.js', 'router.js', 'gulpfile.js', 'nconf.js'], ['server']);
});

gulp.task('default', function () {
    gulp.run('styles', 'scripts', 'server');
});