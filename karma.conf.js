module.exports = function(config) {
    config.set({
        basePath: '',
        browsers: ['PhantomJS'],
        frameworks: ['browserify', 'jasmine'],
        files: [
            { pattern: 'test/*.js', watched: false }
        ],
        preprocessors: {
            'static/js/src/*.js': ['browserify'],
            'test/*.js': ['browserify']
        },
        browserify: {
            debug: true,
            transform: [["babelify", { "presets": ["es2015"] }]]
        },
        colors: true,
        reporters: ['progress'],
        singleRun: true,
        autoWatch: false
    });
};
