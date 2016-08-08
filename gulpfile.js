const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

let sourceFiles = ['src/**/*.js', 'index.js'];
// let sourceFiles = './src/**/*.js';

gulp.task('build', () => {
  return gulp.src(sourceFiles, { base: '.' })
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', ['build'], () => {
  gulp.watch(sourceFiles, ['build'])
});