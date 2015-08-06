var gulp = require('gulp');
var del = require('delete');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var typescript = require('gulp-typescript');
var sourcemap = require('gulp-sourcemaps');
var concat = require('gulp-concat');


var src = {
	ts: ['src/ts/**/*.ts'],
	js: ['src/js/**/*.js']
};

var name = 'ho-ui';

var dist = 'dist';


gulp.task('clean', function() {
	return del.sync(dist + '/d.ts', {
		force: true
	}) && del.sync(dist, {
		force: true
	});
});

gulp.task('package', ['clean'], function() {
	return gulp.src(src.ts)
		.pipe(sourcemap.init())
		.pipe(typescript({
			target: 'es5',
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
			out: 'ui.js',
			declarationFiles: true
		}));
	return ts.dts.pipe(gulp.dest(dist));
});

gulp.task('def-combine', ['def'], function() {
	var src = [
		"bower_components/ho-promise/dist/promise.d.ts",
		"bower_components/ho-watch/dist/watch.d.ts",
		"bower_components/ho-components/dist/components.d.ts",
		"bower_components/ho-flux/dist/flux.d.ts",
		"dist/ui.d.ts"
	];
	return gulp.src(src)
	.pipe(concat('ho-all.d.ts'))
	.pipe(gulp.dest(dist));
});


gulp.task('combine', ['def-combine'], function() {
	var src = [
		"bower_components/ho-promise/dist/promise.js",
		"bower_components/ho-watch/dist/watch.js",
		"bower_components/ho-components/dist/components.js",
		"bower_components/ho-flux/dist/flux.js",
		"dist/ui.js"
	];
	return gulp.src(src)
	.pipe(concat('ho-all.js'))
	.pipe(gulp.dest(dist));
});

gulp.task('combine-min', ['combine'], function() {
	var src = [
		"bower_components/ho-promise/dist/promise.min.js",
		"bower_components/ho-watch/dist/watch.min.js",
		"bower_components/ho-components/dist/components.min.js",
		"bower_components/ho-flux/dist/flux.min.js",
		"dist/ui.min.js"
	];
	return gulp.src(src)
	.pipe(concat('ho-all.min.js'))
	.pipe(gulp.dest(dist));
});


gulp.task('default', ['combine-min'], null);
