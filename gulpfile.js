var gulp = require('gulp');
var del = require('delete');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var typescript = require('gulp-typescript');
var sourcemap = require('gulp-sourcemaps');


var src = {
    ts: ['src/ts/**/*.ts'],
    js: ['src/js/**/*.js']
};

var name = 'ho-ui';

var dist = 'dist';


gulp.task('clean', function() {
    return del.sync(dist+'/d.ts', {force: true}) && del.sync(dist, {force: true});
});

gulp.task('package', ['clean'], function() {
    return gulp.src(src.ts)
    .pipe(sourcemap.init())
    .pipe(typescript({
        sourceMap: true
    }))
    .pipe(sourcemap.write())
    .pipe(gulp.dest(dist));
});


gulp.task('mini', ['package'], function() {
    return gulp.src(dist + '/**/*.js')
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('def', ['mini'], function() {
    var ts = gulp.src(src.ts)
    .pipe(typescript({
        declarationFiles: true
    }));
    return ts.dts.pipe(gulp.dest(dist + '/d.ts'));
});


gulp.task('default', ['def'], null);
