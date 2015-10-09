import gulp from 'gulp';
import runSequence from 'run-sequence';

//import merge from 'merge-stream';

import gulpFilter from 'gulp-filter';

import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';

import del from 'del';

import nodemon from 'gulp-nodemon';


gulp.task('clean-dist', () => del(['dist/**/*']));

gulp.task('clean-css', () => del(['dist/css']));

gulp.task('copy-css', () => {

	return gulp.src('static/css/*')
			.pipe(gulp.dest('dist/css'));
});

gulp.task('build-css', (done) => {
	runSequence('clean-css', 'copy-css', () => { done(); });
});

// - this will make more sense once there are other types of static content....
gulp.task('build-static', ['build-css']);


gulp.task('build-dist', (done) => {

	runSequence('clean-dist', 'build-static', () => {

		var jsFilter = gulpFilter('**/*.{js,jsx}', {restore:true});

		gulp.src('src/**/*')

				.pipe(jsFilter)
				.pipe(sourcemaps.init())
				.pipe(babel())
				.pipe(sourcemaps.write("."))
				.pipe(jsFilter.restore)

				.pipe(gulp.dest('dist'));

		done();
	});
});


//gulp.task('build', ['clean', 'dist-js', 'dist-assets']);

gulp.task('watch', () => {
	gulp.watch('src/**/*', ['build-dist']);
	gulp.watch('static/**/*', ['build-static']);
});

gulp.task('dev', ['watch'], () => {

	runSequence('build-dist', () => {

		setTimeout(() => {

			nodemon({ script: 'dist/app.js'
				//, ext: 'html js'
				//, ignore: ['ignored.js']
				//, tasks: ['lint']
			}).on('restart', function () {
				console.log('restarted!');
				//runSequence('watch');
			});

		}, 500);



	});
});


gulp.task('default', ['watch']);


import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';

import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import merge from 'utils-merge';
import gutil from 'gulp-util';

import rename from 'gulp-rename';
import uglify from 'gulp-uglify'

import chalk from 'chalk';

gulp.task('browser', function () {
	// set up the browserify instance on a task basis
	//var b = browserify({
	//	//entries: 'js/client-router.js',
	//	debug: true
	//});
	//
	//return b.bundle()
	//		.pipe(source('src/js/client-router.js'))
	//		.pipe(buffer())
	//		.pipe(sourcemaps.init({loadMaps: true}))
	//		// Add transformation tasks to the pipeline here.
	//		//.pipe(uglify())
	//		.on('error', gutil.log)
	//		.pipe(sourcemaps.write('./'))
	//		.pipe(gulp.dest('./dist/js'));

	var args = merge(watchify.args, { debug: true });
	var bundler = watchify(browserify('dist/routes/client-router.js', args))
			.transform(babelify, { /* opts */ });

	bundle_js(bundler)

	bundler.on('update', function () {
		bundle_js(bundler)
	})

});

function bundle_js(bundler) {
	return bundler.bundle()
			.on('error', map_error)
			.pipe(source('dist/routes/client-router.js'))
			.pipe(buffer())
			.pipe(gulp.dest('app/dist'))
			.pipe(rename('app.min.js'))
			.pipe(sourcemaps.init({ loadMaps: true }))
			// capture sourcemaps from transforms
			.pipe(uglify())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest('app/dist'))
}

function map_error(err) {
	if (err.fileName) {
		// regular error
		gutil.log(chalk.red(err.name)
				+ ': '
				+ chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
				+ ': '
				+ 'Line '
				+ chalk.magenta(err.lineNumber)
				+ ' & '
				+ 'Column '
				+ chalk.magenta(err.columnNumber || err.column)
				+ ': '
				+ chalk.blue(err.description))
	} else {
		// browserify error..
		gutil.log(chalk.red(err.name)
				+ ': '
				+ chalk.yellow(err.message))
	}

	this.end()
}



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