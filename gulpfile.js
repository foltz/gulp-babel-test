var gulp = require("gulp");
var gutil = require("gulp-util");

var gulpFilter = require("gulp-filter");

var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");


var concat = require("gulp-concat");
var rename = require("gulp-rename");
var del = require("del");

var nodemon = require("gulp-nodemon");

var browserify = require("browserify");
var babelify = require("babelify");
var uglifyify = require("uglifyify");

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

	delFilesIn(dir, done) {
		del([dir + "/**/*.{js,hbs,css,map}"]).then(done)
	},


	// --------------------------------------------------------------------
	// - CLEAN
	// --------------------------------------------------------------------

	deleteWWW: function (done) {
		del(this.distRoot).then(done)
	},

	clean: function (done) {            this.delFilesIn(this.distRoot, done) },

	cleanServer: function (done) {      this.delFilesIn(this.distServer, done) },

	cleanClient: function (done) {      this.delFilesIn(this.distClient, done) },
	cleanClientCss: function (done) {   this.delFilesIn(this.distCss, done) },
	cleanClientJs: function (done) {    this.delFilesIn(this.distJs, done) },


	// --------------------------------------------------------------------
	// - BUILD
	// --------------------------------------------------------------------


	build: function() { this.buildClient(); this.buildServer(); },


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
	},


	buildServer: function (done) {

		this.buildServerApp();
		this.buildServerRouter();
	},

	buildServerApp: function (done) {

		var jsFilter = gulpFilter('**/*.{js,jsx}', {restore: true});

		gulp.src(this.srcApp + "/**/*")

			.pipe(jsFilter)
			.pipe(sourcemaps.init())
			.pipe(babel())
			.pipe(sourcemaps.write("."))
			.pipe(jsFilter.restore)

			.pipe(gulp.dest(this.distApp))

			.on('error', gutil.log)

			.on('end', () => {
				this.whenDone(done);
			});
	},

	buildServerRouter: function (done) {

		var jsFilter = gulpFilter('**/serverRouter.jsx', {restore: true});

		gulp.src(this.srcRoot + "/**/*")

			.pipe(jsFilter)
			.pipe(sourcemaps.init())
			.pipe(babel())
			.pipe(sourcemaps.write("."))

			.pipe(gulp.dest(this.distServer))

			.on('error', gutil.log)

			.on('end', () => {
				this.whenDone(done);
			});
	},

	// --------------------------------------------------------------------
	// - RUN
	// --------------------------------------------------------------------


	runServer: function (scriptName, done) {

		nodemon({
			script: "run/" + scriptName + ".js"
			,watch: ["src/**/*"]
			,delay:0
			,tasks: ["build"]
			, ext: "html js hbs"
			//, ignore: ["ignored.js"]
		}).on("restart", function () {
			console.log("restarted!");
			//runSequence("watch");
		});
	},


	runWatch: function (done) {

		gulp.watch('src/**/*.css', () => {
			console.log('rebuild CSS');
			this.buildClientCss();
		}); // - build-js = client-router...


		//gulp.watch('src/**/*', ['build']); // - build-js = client-router...
		//gulp.watch('src/client/css/*', ['build-css']);
		//gulp.watch('src/client/js/*', ['build-js']);
	},

	runDev: function (done) {
		this.runWatch();
		this.runServer("dev");
	},

	runDev_ServerOnly: function (done) {
		this.runWatch();
		this.runServer("dev-server-only");
	},

	runDev_ClientOnly: function (done) {
		this.runWatch();
		this.runServer("dev-client-only");
	}
};

gulp.task('delete-WWW', () => gulpTasks.deleteWWW());
gulp.task('clean', () => gulpTasks.clean());


gulp.task('clean-client', () => gulpTasks.cleanClient());
gulp.task('clean-client-css', () => gulpTasks.cleanClientCss());
gulp.task('clean-client-js', () => gulpTasks.cleanClientJs());

gulp.task('clean-server', () => gulpTasks.cleanServer());


gulp.task('build', () => gulpTasks.build());

gulp.task('build-client', () => gulpTasks.buildClient());
gulp.task('build-client-css', () => gulpTasks.buildClientCss());
gulp.task('build-client-router', () => gulpTasks.buildClientRouter());
gulp.task('build-client-router-min', () => gulpTasks.buildClientRouterMin());


gulp.task('build-server', () => gulpTasks.buildServer());
gulp.task('build-server-app', () => gulpTasks.buildServerApp());
gulp.task('build-server-router', () => gulpTasks.buildServerRouter());



//gulp.task('watch', () => gulpTasks.runWatch());
gulp.task('dev', () => gulpTasks.runDev());
gulp.task('dev-server-only', () => gulpTasks.runDev_ServerOnly());
gulp.task('dev-client-only', () => gulpTasks.runDev_ClientOnly());

//
//gulp.task('run-server', tasks.runServer);
//gulp.task('run-watch', tasks.runWatch);
//
//gulp.task('default', ['run-watch']);