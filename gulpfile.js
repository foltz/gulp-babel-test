var gulp = require("gulp");
var runSequence = require("run-sequence");

var gulpFilter = require("gulp-filter");

var babel = require("gulp-babel");
var sourcemaps = require("gulp-sourcemaps");


var concat = require("gulp-concat");
var rename = require("gulp-rename");
var del = require("del");
var rimraf = require("del");

var nodemon = require("gulp-nodemon");

var browserify = require("browserify");
var babelify = require("babelify");
var literalify = require("literalify");

var uglifyify = require("uglifyify");
var minifyify = require("minifyify");

var source = require("vinyl-source-stream");

var gulpTasks = {


	srcRoot: "src",
	distRoot: "www",

	distServer: "www/server",

	srcApp: "src/app",
	distApp: "www/server/app",

	distClient: "www/client",

	srcCss: "src/app/css",
	distCss: "www/client/css",

	//srcJs: "src/js",
	distJs: "www/client/js",


	//distDir: function(subDir) { return this.distRoot + "/" + subDir },

	whenDone: function(done) {
		if (typeof done === "function") done();
	},



	clean: function (done) { del([this.distRoot]).then(done) },

	cleanServer: function (done) { del([this.distServer]).then(done) },

	cleanClient: function (done) { del([this.distClient]).then(done) },
	cleanClientCss: function (done) { del([this.distCss]).then(done) },
	cleanClientJs: function (done) { del([this.distJs]).then(done) },



	build: function() { this.buildServer(); this.buildClient(); },

	buildServer: function (done) {

		this.buildServerApp();
		this.buildServerRouter();
	},

	buildServerApp: function (done) {

		//this.cleanServer(() => {

		var clientFilter = gulpFilter('!client.js');
		var jsFilter = gulpFilter('**/*.{js,jsx}', {restore: true});

		gulp.src(this.srcApp + "/**/*")

			.pipe(jsFilter)
			.pipe(sourcemaps.init())
			.pipe(babel())
			.pipe(sourcemaps.write("."))
			.pipe(jsFilter.restore)
			//.pipe(clientFilter)
			.pipe(gulp.dest(this.distApp));

		//});

		this.whenDone(done);
	},

	buildServerRouter: function (done) {

		//this.cleanServer(() => {

		var clientFilter = gulpFilter('!client.js');
		var jsFilter = gulpFilter('**/serverRouter.jsx', {restore: true});

		gulp.src(this.srcRoot + "/**/*")

			.pipe(jsFilter)
			.pipe(sourcemaps.init())
			.pipe(babel())
			.pipe(sourcemaps.write("."))
			//.pipe(jsFilter.restore)

			.pipe(gulp.dest(this.distServer));

		//gulp.src(this.srcRoot + "/**/*")
		//	.pipe(jsFilter)
		//	.pipe(sourcemaps.init())
		//	.pipe(babel())
		//	.pipe(sourcemaps.write("."))
		//	.pipe(jsFilter.restore)
		//
		//	.pipe(gulp.dest(this.distApp));
		//});

		this.whenDone(done);
	},

	buildClient: function() {

		this.buildClientCss();
		this.buildClientRouter();
		//this.buildClientRouterMin();
	},

	buildClientCss: function (done) {

		this.cleanClientCss(() => {
			gulp.src(this.srcCss + "/*")
					.pipe(gulp.dest(this.distCss));
		});

		this.whenDone(done);
	},

	buildClientRouter: function (done) {

		var bundler = browserify({
				entries: [this.srcRoot + "/clientRouter.js"],
				transform: [babelify],
				extensions: ['.js', '.jsx'],
				debug: true // Gives us sourcemapping
				//cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
			});

		bundler.bundle() // Create the initial bundle when starting the task
			.pipe(source('clientRouter.js'))
			.pipe(gulp.dest(this.distJs));


		this.whenDone(done);

	},

	buildClientRouterMin: function (done) {

		var bundler = browserify({
			entries: [this.srcRoot + "/clientRouter.js"],
			transform: [babelify],
			extensions: ['.js', '.jsx'],
			debug: false // no sourcemapping
		});

		bundler.transform({ global: true}, 'uglifyify');

		bundler.bundle() // Create the initial bundle when starting the task
			.pipe(source('clientRouter.js'))
			.pipe(rename('clientRouter.min.js'))
			.pipe(gulp.dest(this.distJs));

		this.whenDone(done);
	}
};


gulp.task('clean', () => gulpTasks.clean());
gulp.task('clean-server', () => gulpTasks.cleanServer());
//
gulp.task('clean-client', () => gulpTasks.cleanClient());
gulp.task('clean-client-css', () => gulpTasks.cleanClientCss());
gulp.task('clean-client-js', () => gulpTasks.cleanClientJs());


gulp.task('build', () => gulpTasks.build());
gulp.task('build-server', () => gulpTasks.buildServer());
gulp.task('build-server-app', () => gulpTasks.buildServerApp());
gulp.task('build-server-router', () => gulpTasks.buildServerRouter());

gulp.task('build-client', () => gulpTasks.buildClient());
gulp.task('build-client-css', () => gulpTasks.buildClientCss());
gulp.task('build-client-router', () => gulpTasks.buildClientRouter());
gulp.task('build-client-router-min', () => gulpTasks.buildClientRouterMin());


//
//gulp.task('run-server', tasks.runServer);
//gulp.task('run-watch', tasks.runWatch);
//
//gulp.task('default', ['run-watch']);