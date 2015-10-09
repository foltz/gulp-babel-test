import gulp from 'gulp';
import runSequence from 'run-sequence';

//import merge from 'merge-stream';

import gulpFilter from 'gulp-filter';

import babel from 'gulp-babel';
import sourceMaps from 'gulp-sourcemaps';

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
				.pipe(sourceMaps.init())
				.pipe(babel())
				.pipe(sourceMaps.write("."))
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