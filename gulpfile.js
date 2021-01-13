'use strict'

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const exec = require('gulp-exec');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const cp = require('child_process');

gulp.task('css', () => {
    return gulp.src('_assets/css/**/*.css')
        // .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./docs/css/'))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('jekyll', () => {
    return cp.spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit', shell: true });
});

gulp.task('watch', () => {
    browserSync.init({
        server: {
            baseDir: './docs/'
        }
    });

    gulp.watch('_assets/css/**/*.css', gulp.series('css'));

    gulp.watch(
        [
            './*.html',
            './_includes/*.html',
            './_layouts/*.html',
            './_posts/**/*.*',
        ]
    ).on('change', gulp.series('jekyll', 'css'));

    gulp.watch('docs/**/*.html').on('change', browserSync.reload);
    gulp.watch('docs/**/*.js').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('jekyll', 'css', 'watch'));