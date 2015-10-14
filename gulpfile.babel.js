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


	cleanWww : () => del(['www']),
	cleanApp : () => del(['www/app']),

	cleanClient : () => del(['www/client']),
	cleanCss : () => del(['www/client/css']),
	cleanJs : () => del(['www/client/js']),

	//cleanBuild : () => del(['build']),

	buildApp: (done) => {

		runSequence('clean-app', () => {

			var jsFilter = gulpFilter('**/*.{js,jsx}', {restore:true});

			gulp.src('src/app/**/*')

					.pipe(jsFilter)
					.pipe(sourcemaps.init())
					.pipe(babel())
					.pipe(sourcemaps.write("."))
					.pipe(jsFilter.restore)

					.pipe(gulp.dest('www/app'));

			done();
		});
	},


	buildCss: (done) => {
		runSequence('clean-css', () => {

			// - currently it just copies the code....

			gulp.src('src/client/css/*')
					.pipe(gulp.dest('www/client/css'));

			done();
		});
	},



	buildJs_ClientRoutes: () => {

		var bundler = browserify({
			entries: ['./src/client/js/client-router.js'], // Only need initial file, browserify finds the deps
			transform: [babelify], // We want to convert JSX to normal javascript
			extensions: ['.js', '.jsx'],
			debug: true, // Gives us sourcemapping
			//cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify

		});

		bundler.bundle() // Create the initial bundle when starting the task
				.pipe(source('client-router.js'))
				.pipe(gulp.dest('www/client/js'))
	},

	minifyJs_ClientRoutes: () => {

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
				.pipe(gulp.dest('dist/js'));
		//.pipe(fs.createWriteStream(outputFile));
	},

	uglifyJs_ClientRoutes: () => {

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
				.pipe(gulp.dest('dist/js'))
	},



	runServer: () => {

		nodemon({ script: 'www/app/server.js'
			//, ext: 'html js'
			//, ignore: ['ignored.js']
			//, tasks: ['lint']
		}).on('restart', function () {
			console.log('restarted!');
			//runSequence('watch');
		});
	},

	runWatch: () => {

		gulp.watch('src/app/**/*', ['build-app']); // - build-js = client-router...
		gulp.watch('src/client/css/*', ['build-css']);
		gulp.watch('src/client/js/*', ['build-js']);
	}

};

gulp.task('clean-www', tasks.cleanWww);
gulp.task('clean-app', tasks.cleanApp);

gulp.task('clean-client', tasks.cleanClient);
gulp.task('clean-css', tasks.cleanCss);
gulp.task('clean-js', tasks.cleanJs);

gulp.task('build-app', tasks.buildApp);
gulp.task('build-css', tasks.buildCss);

gulp.task('build-js', tasks.buildJs_ClientRoutes);
gulp.task('ugl-client', tasks.uglifyClientRoutes);
gulp.task('min-client', tasks.minifyClientRoutes);

gulp.task('run-server', tasks.runServer);
gulp.task('run-watch', tasks.runWatch);

gulp.task('default', ['run-watch']);