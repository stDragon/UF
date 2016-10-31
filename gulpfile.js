var gulp        = require('gulp'),
    browserify  = require('gulp-browserify'),
    concat      = require('gulp-concat'),
    server      = require('gulp-express'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify');

gulp.task('concatMain', ['concatUm'], function() {
    return gulp.src([
            'scripts/main.js'
        ])
        .pipe(concat('main.js'))
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('public/js'));
});

/* несжатый скрипт модуля*/
gulp.task('concatUm', function() {
    return gulp.src([
            'scripts/um.js'
        ])
        .pipe(concat('marya-um.full.js'))
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('compressMain', ['concatMain'], function() {
    return gulp.src(['scripts/main.js', 'public/js/main.js'])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('public/js'));
});

/* сжатый скрипт модуля */
gulp.task('compressUm', ['concatUm'], function() {
    return gulp.src(['public/js/marya-um.full.js'])
        .pipe(uglify())
        .pipe(rename({
            basename: 'marya-um'
        }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('sass', function () {
    gulp.src('./styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('styles', ['sass']);
gulp.task('scripts', ['concatUm', 'compressUm', 'concatMain', 'compressMain']);

gulp.task('server', function () {

    server.run(['app.js']);
    
    gulp.run('styles', 'scripts');

    gulp.watch('./scripts/**/*.js', ['scripts']);
    gulp.watch('./styles/**/*.scss', ['sass']);

    gulp.watch(['app.js','server.js', 'nconf.js'], [server.run]);
});

gulp.task('default', ['server']);