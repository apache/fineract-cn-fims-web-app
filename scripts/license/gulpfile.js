var gulp = require('gulp');
var license = require('gulp-header-license');
var fs = require('fs');

gulp.task('licenseTS', function () {
  gulp.src('../../src/**/*.ts')
    .pipe(license(fs.readFileSync('HEADER_TS', 'utf8')))
    .pipe(gulp.dest('../../src/'));
});

gulp.task('licenseHTML', function () {
  gulp.src('../../src/**/*.html')
    .pipe(license(fs.readFileSync('HEADER_HTML', 'utf8')))
    .pipe(gulp.dest('../../src/'));
});

gulp.task('licenseSCSS', function () {
  gulp.src('../../src/**/*.scss')
    .pipe(license(fs.readFileSync('HEADER_SCSS', 'utf8')))
    .pipe(gulp.dest('../../src/'));
});

gulp.task('default', ['licenseTS', 'licenseHTML', 'licenseSCSS']);

