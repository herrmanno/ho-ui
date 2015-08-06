var gulp = require('gulp');
var del = require('delete');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var typescript = require('gulp-typescript');
var sourcemap = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var shell = require('gulp-shell');

var name = 'ho-ui';
var dist = 'dist';
var src = {
	ts: ['src/ts/**/*.ts'],
	js: ['src/js/**/*.js']
};
var modules = {
	declarations: [
		"dependencies/promise/dist/promise.d.ts",
		"dependencies/watch/dist/watch.d.ts",
		"dependencies/components/dist/components.d.ts",
		"dependencies/flux/dist/flux.d.ts",
		"dist/ui.d.ts"
	],
	js: [
		"dependencies/promise/dist/promise.js",
		"dependencies/watch/dist/watch.js",
		"dependencies/components/dist/components.js",
		"dependencies/flux/dist/flux.js",
		"dist/ui.js"
	],
	min: [
		"dependencies/promise/dist/promise.min.js",
		"dependencies/watch/dist/watch.min.js",
		"dependencies/components/dist/components.min.js",
		"dependencies/flux/dist/flux.min.js",
		"dist/ui.js"
	]
};




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
	return gulp.src(modules.declarations)
	.pipe(concat('ho-all.d.ts'))
	.pipe(gulp.dest(dist));
});


gulp.task('combine', ['def-combine'], function() {
	return gulp.src(modules.js)
	.pipe(sourcemap.init({loadMaps:true}))
	.pipe(concat('ho-all.js'))
	.pipe(sourcemap.write())
	.pipe(gulp.dest(dist));
});

gulp.task('combine-min', ['combine'], function() {
	return gulp.src(modules.min)
	.pipe(concat('ho-all.min.js'))
	.pipe(gulp.dest(dist));
});

gulp.task('sub:commit', shell.task([
  'git submodule foreach \'git commit -a -m "submodule changed" 2> nul\'',
]));

gulp.task('update:remote', shell.task([
  'git submodule foreach git pull',
]));

gulp.task('update:local', shell.task([
  'git submodule foreach git reset --hard local/master',
  'git submodule foreach git pull local master',
]));


gulp.task('default', ['combine-min'], null);
