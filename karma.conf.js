// Karma configuration

module.exports = function(config) {
    var gulpConfig = require('./gulp.config.js');

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai'],
        // frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],


        // list of files / patterns to load in the browser
        files: gulpConfig.karma.files,


        // list of files to exclude
        exclude: gulpConfig.karma.exclude,


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'www/app/!(*spec)*.js' :        ['coverage'],
            'www/app/**/!(*spec)*.js' :    ['coverage'],
        },

        // your Angular HTML Templates need to be compiled to javascript otherwise you will get a parse error on running Karma
        // ngHtml2JsPreprocessor: {
        //     stripPrefix: 'www/',  
        //     moduleName: 'ngHtmlTemplates'  // include beforeEach(module('ngHtmlTemplates')) in unit tests
        // },

        // Configure the reporter 
        coverageReporter: {
          dir : 'test_reports/unit_test_coverage/frontend',
                reporters: [
                { type: 'html', subdir: 'report-html' },
              ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['clear-screen','mocha','html','coverage'],
        // reporters: ['mocha'],

        htmlReporter: {
          outputFile: 'test_reports/unit_test_results/frontend/index.html'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true, //THIS IS FALSE CAUSE WE ARE CLEARING THE CONSOLE ON WATCH VIA GULP


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            // 'Chrome',
            // 'ChromeCanary',
            // 'Firefox',
            // 'Opera',
            // 'Safari', // (only Mac)
            'PhantomJS',
            // 'IE' // (only Windows)
        ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
