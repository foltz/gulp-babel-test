var gulp = require('gulp');
var gulpFilter = require('gulp-filter');

var babel = require('gulp-babel');
var sourceMaps = require("gulp-sourcemaps");

var del = require('del');


gulp.task('clean', function () {
	return del(['dist/**/*']);
});


gulp.task('build', ['clean'], function () {

	var jsFilter = gulpFilter('**/*.{js,jsx}', {restore:true});

	return gulp.src('src/**/*')

			.pipe(jsFilter)
			.pipe(sourceMaps.init())
			.pipe(babel())
			.pipe(sourceMaps.write("."))
			.pipe(jsFilter.restore)

			.pipe(gulp.dest('dist'));
});

gulp.task('dist-assets', function () {

	var jsFilter = gulpFilter(['*.js$']);
	return gulp.src('src/**/*')

		.pipe(filter)
		.pipe(gulp.dest('dist'));
});

//gulp.task('build', ['clean', 'dist-js', 'dist-assets']);

gulp.task('watch', ['build'], function () {
	gulp.watch('src/**/*', ['build']);
});

gulp.task('default', ['watch']);


//var gulp = require('gulp');
//var browserify = require('browserify');
//var babelify = require('babelify');
//var source = require('vinyl-source-stream');
//
//gulp.task('build', function () {
//	return browserify({entries: 'src/components/App/App.js', extensions: ['.js'], debug: true})
//			.transform(babelify)
//			.bundle()
//			.pipe(source('bundle.js'))
//			.pipe(gulp.dest('dist'));
//});
//
//gulp.task('watch', ['build'], function () {
//	gulp.watch('*.jsx', ['build']);
//});
//
//gulp.task('default', ['watch']);