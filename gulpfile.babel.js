import gulp from 'gulp';
import runSequence from 'run-sequence';

import gulpFilter from 'gulp-filter';

import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';


import concat from 'gulp-concat';
import rename from 'gulp-rename';
import del from 'del';

import nodemon from 'gulp-nodemon';

import browserify from 'browserify';
import babelify from 'babelify';

import uglifyify from 'uglifyify';
import minifyify from 'minifyify';

import source from 'vinyl-source-stream';

let tasks = {


	cleanDist : () => del(['dist/**/*']),
	cleanCss : () => del(['dist/css']),
	cleanBuild : () => del(['build']),

	copyCss: () => {

		return gulp.src('static/css/*')
				.pipe(gulp.dest('dist/css'));
	},

	buildCss: (done) => {
		runSequence('clean-css', 'copy-css', () => { done(); });
	},

	buildDist: (done) => {

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
	},

	buildClientRoutes: () => {

		var bundler = browserify({
			entries: ['./src/routes/client-router.js'], // Only need initial file, browserify finds the deps
			transform: [babelify], // We want to convert JSX to normal javascript
			extensions: ['.js', '.jsx'],
			debug: true, // Gives us sourcemapping
			//cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify

		});
		//bundler.plugin('minifyify', {map: 'bundle.map.json'});

		bundler.bundle() // Create the initial bundle when starting the task
				.pipe(source('client-router.js'))
				.pipe(gulp.dest('build'))
	},

	uglifyClientRoutes: () => {

		var bundler = browserify({
			entries: ['./src/routes/client-router.js'], // Only need initial file, browserify finds the deps
			transform: [babelify], // We want to convert JSX to normal javascript
			extensions: ['.js', '.jsx'],
			//debug: true, // Gives us sourcemapping
			//cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify

		});

		bundler.transform({
			global: true
		}, 'uglifyify')

		bundler.bundle() // Create the initial bundle when starting the task
				.pipe(source('client-router.js'))
				.pipe(rename('client-router.ugl.js'))
				.pipe(gulp.dest('build'))
	},

	minifyClientRoutes: () => {

		var outputFile = 'build/client-router.min.js';

		var bundler = browserify({
			entries: ['./src/routes/client-router.js'], // Only need initial file, browserify finds the deps
			transform: [babelify], // We want to convert JSX to normal javascript
			extensions: ['.js', '.jsx'],
			debug: true, // Gives us sourcemapping
			//cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify

		});

		//bundler.add('./src/routes/client-router.js');

		bundler.plugin('minifyify',
				{
					map: 'bundle.map.json',
					output: outputFile
				});

		bundler.bundle()
				.pipe(source('client-router.js'))
				.pipe(rename('client-router.min.js'))
				.pipe(gulp.dest('build'))
				//.pipe(fs.createWriteStream(outputFile));
	},

	runDevServer: () => {

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
	},

	runWatch: () => {

		gulp.watch('src/**/*', ['build-dist']);
		gulp.watch('static/**/*', ['build-static']);
	}

};

gulp.task('clean-dist', tasks.cleanDist);
gulp.task('clean-css', tasks.cleanCss);
gulp.task('clean-build', tasks.cleanBuild);

gulp.task('copy-css', tasks.copyCss);

gulp.task('build-css', tasks.buildCss);

// - this will make more sense once there are other types of static content....
gulp.task('build-static', ['build-css']);
gulp.task('build-dist', tasks.buildDist);
gulp.task('build-client', tasks.buildClientRoutes);
gulp.task('ugl-client', tasks.uglifyClientRoutes);
gulp.task('min-client', tasks.minifyClientRoutes);

gulp.task('run-dev', ['run-watch'], tasks.runDevServer);
gulp.task('run-watch', tasks.runWatch);

gulp.task('default', ['run-watch']);