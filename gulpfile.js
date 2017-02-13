var gulp = require('gulp'),
    serve = require('gulp-serve'),
    jshint = require('gulp-jshint'),
	jshintReporter = require('jshint-stylish'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	gutil = require('gulp-util'),
	less = require('gulp-less'),
	LessPluginCleanCSS = require('less-plugin-clean-css'),
    cleanCSS = new LessPluginCleanCSS({ advanced: true }),
    babelify = require('babelify'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglifyjs'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
    stripCode = require('gulp-strip-code'),
    Karma = require('karma').Server;
	gulpCopy = require('gulp-copy'),
	del = require('del'),
	distRoot = 'dist/',
	staticRoot = 'static/',
	jsRoot = staticRoot + 'js/',
	nodeModulesRoot = 'node_modules/',
	paths = {
		jsRoot: jsRoot,
		common: [
			nodeModulesRoot + 'jquery/dist/jquery.js',
			nodeModulesRoot + 'bootstrap/dist/bootstrap.js',
			nodeModulesRoot + 'underscore/underscore.js'
		],
		less: staticRoot + 'less/',
		css: staticRoot + 'css/',
		browserifySrc: [jsRoot + 'src/app.js'],
		jsDist: jsRoot + 'dist/'
	};

function reportChange(event){
	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

function getFileName(path) {
	return path.substr(path.lastIndexOf('/') + 1);
}

gulp.task('compile-bootstrap', function() {
	return gulp.src(nodeModulesRoot + 'bootstrap/less/**/*.less')
		.pipe(plumber(function(error) {
			gutil.beep();
			gutil.log(error);
		}))
		.pipe(less({
	        plugins: [cleanCSS]
	      }))
		.pipe(concat('bootstrap.min.css'))
		.pipe(gulp.dest(paths.css));
});

// compile Less to CSS
gulp.task('compile-less', function() {
  return gulp.src(paths.less + '*.less')
    .pipe(plumber(function(error) {
      gutil.beep();
      gutil.log(error);
    }))
    .pipe(less({
        plugins: [cleanCSS]
      }))
	.pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.css));
});

// Transpile ES6 and Browserify js source files
gulp.task('transpile', function(callback) {
	paths.browserifySrc.forEach(function(path) {
		var filename = getFileName(path),
			bundler = new browserify({ debug: true }),
			sourcemapPath = paths.jsDist + filename.split('.')[0] + '.map.json';

		bundler.add(path);
		bundler.plugin('minifyify', {
			map: sourcemapPath,
			output: sourcemapPath
		});
        bundler.transform('babelify', { presets: ['es2015'] });

		return bundler.bundle()
				.pipe(plumber(function(error) {
				  gutil.beep();
				  gutil.log(error);
				}))
				.pipe(source(filename))
				.pipe(rename({
					suffix: '.min'
				}))
				.pipe(gulp.dest(paths.jsDist));
	});

	callback();
});

gulp.task('copy', function(callback) {
	gulp.src('index.html').pipe(gulp.dest(distRoot));
	gulp.src('static/css/*.css').pipe(gulp.dest(distRoot + 'static/css'));
	gulp.src('static/images/*').pipe(gulp.dest(distRoot + 'static/images'));
	gulp.src('static/js/dist/*.js').pipe(gulp.dest(distRoot + 'static/js/dist'));
	gulp.src('static/js/dist/*.map.json').pipe(gulp.dest(distRoot + 'static/js/dist'));

	callback();
});

gulp.task('clean', function(callback) {
	del('dist/*');
	callback();
});

gulp.task('test', function(done) {
    new Karma({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('watch', function() {
	gulp.watch(paths.less + '*.less', ['compile-less']).on('change', reportChange);
	gulp.watch(jsRoot + 'src/*.js', ['build']).on('change', reportChange);
});

gulp.task('serve', serve({
	root: '.',
	port: 9000
}));

gulp.task('serve-prod', serve({
	root: 'dist',
	port: 9000
}));

gulp.task('default', ['watch', 'serve']);
gulp.task('build', ['transpile', 'copy']);
