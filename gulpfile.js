var gulp = require('gulp')
var fs   = require("fs");

//--GULP PLUGINS----------------------------------------------------------------------
var mainBowerFiles  = require('main-bower-files')
var inject          = require("gulp-inject");
var replace         = require('gulp-replace');
var chalk           = require('chalk');
var runSequence     = require('run-sequence');
// var notify          = require("gulp-notify");
// var print           = require("gulp-print");
// var globby          = require('globby');
var nodemon         = require('gulp-nodemon');
// var livereload      = require('gulp-livereload');
var open            = require('gulp-open');
var plumber         = require('gulp-plumber');
var browserSync     = require('browser-sync');
var reload          = browserSync.reload;







/**************************************************************************************/
/*          FILE PATHS                                                                */
/**************************************************************************************/
var serverFilePath = './server/server.js;'
var watchFiles = [
  'www/app/js/*.js',
  'www/app/css/*.css',
  'www/app/**/*.css',
  'www/app/*.html'
];







/**************************************************************************************/
/*          DEV TASKS                                                                 */
/**************************************************************************************/

// Bower files
gulp.task('cleanBowerTags', function() {
    // regex 3rd party
    var regexBowerCss   = /<!-- bower:css -->([\s\S]*?)<!-- endinject -->/g;
    var regexBowerJs    = /<!-- bower:js -->([\s\S]*?)<!-- endinject -->/g;
    // clean 3rd party tags
    var cleanBowerCss   = "<!-- bower:css -->\n\t<!-- endinject -->";
    var cleanBowerJs    = "<!-- bower:js -->\n<!-- endinject -->";
    return gulp
            .src(['./www/index.html'])
            .pipe(plumber())
            .pipe(replace(regexBowerCss, cleanBowerCss))
            .pipe(replace(regexBowerJs, cleanBowerJs))
            .pipe(gulp.dest('./www/'))
});
gulp.task('injectBowerTags', function () {
    return gulp
            .src('./www/index.html')
            .pipe(plumber())
            .pipe(inject(gulp.src(mainBowerFiles({}), {read: false}),  {name: 'bower'}))
            .pipe(replace('/www/', ''))
            .pipe(gulp.dest('./www'))
});

// Client code
gulp.task('cleanClientTags', function() {
    // regex client
    var regexInjectCss  = /<!-- inject:css -->([\s\S]*?)<!-- endinject -->/g;
    var regexInjectJs   = /<!-- inject:js -->([\s\S]*?)<!-- endinject -->/g;
    // clean tags
    var cleanInjectCss  = "<!-- inject:css -->\n\t<!-- endinject -->";
    var cleanInjectJs   = "<!-- inject:js -->\n\<!-- endinject -->";

    return gulp
            .src(['./www/index.html'])
            .pipe(replace(regexInjectCss, cleanInjectCss))
            .pipe(replace(regexInjectJs, cleanInjectJs))
            .pipe(gulp.dest('./www/'));
});
gulp.task('injectClientTags', function () {
    var filterDevContent = [
        './www/app/js/*.js',
        './www/app/css/*.css'
    ];
    return gulp
            .src('./www/index.html')
            .pipe(plumber())
            .pipe(inject(gulp.src(filterDevContent, {read: false})))
            .pipe(replace('/www/', ''))
            .pipe(gulp.dest('./www'))
});








/**************************************************************************************/
/*          WATCH                                                                     */
/**************************************************************************************/
gulp.task('watch',function(){
  var cssjsFiles = ['www/app/css/*.css','www/app/js/*.js'];
  gulp.watch(cssjsFiles,inject);

});











/**************************************************************************************/
/*          DEV-SERVER                                                                */
/**************************************************************************************/

function openBrowserApp(openApp){
  if (openApp == "osx-chrome"){
    return '/Applications/Google Chrome.app';
  } else if (openApp == "linux-chrome"){
    return 'google-chrome';
  } else if (openApp == "windows-chrome"){
    return 'chrome';
  } else if (openApp == "osx-firefox"){
    return '/Applications/firefox.app';
  }
}
var BROWSER_SYNC_RELOAD_DELAY = 500;// we'd need a slight delay to reload browsers connected to browser-sync after restarting nodemon
gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
      script:serverFilePath,
      ext: '*.js'
    })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { 
        called = true;
        cb();
      }
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false   //
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});
 
gulp.task('browser-sync', ['nodemon'], function () {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync.init({
 
    // watch the following files; changes will be injected (css & images) or cause browser to refresh
    files: watchFiles,
 
    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:8080',
 
    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    // port: 4000,

 
    // Stop the browser from automatically opening
    open: false,  // "local", "external", "ui", "tunnel"

    // open the proxied app in chrome
    // browser: ['google chrome']
    // browser: ["google chrome", "firefox"]

    // Don't show any notifications in the browser.
    notify: false // will remove the small notification message in the browser

    // Wait for 2 seconds before any browsers should try to inject/reload a file.
    //reloadDelay: 2000
  });
});
gulp.task('browser-sync-open', ['nodemon'], function () {
  browserSync.init({
    files: watchFiles,
    proxy: 'http://localhost:8080',
    browser: openBrowserApp("osx-chrome"),
    open: true,  // "local", "external", "ui", "tunnel"
    notify: false // will remove the small notification message in the browser
  });
});
gulp.task('browser-sync-dist', ['nodemon'], function () {
  browserSync.init({
    files: watchDistFiles,
    proxy: 'http://localhost:8080',
    browser: openBrowserApp("osx-chrome"),
    open: true,  // "local", "external", "ui", "tunnel"
    notify: false // will remove the small notification message in the browser
  });
});










/**************************************************************************************/
/*          TESTING                                                                   */
/**************************************************************************************/

  // NEEED TO MOLD TO THIS APP
                                        /**/
                                        //--Frontend Test-----------------------------------------------------------------------
                                        var karma       = require('gulp-karma');
                                        gulp.task('test-frontend', function() {
                                          // Be sure to return the stream
                                          return gulp.src(frontendTestFiles)
                                            .pipe(plumber())
                                            .pipe(karma({
                                              configFile: 'karma.conf.js',
                                              action: 'watch'
                                            }))
                                            .on('error', function(err) {
                                              // Make sure failed tests cause gulp to exit non-zero
                                              console.log(err);
                                            });
                                        });
                                        gulp.task('test-frontend-once', function() {
                                          // Be sure to return the stream
                                          return gulp.src(frontendTestFiles)
                                            .pipe(plumber())
                                            .pipe(karma({
                                              configFile: 'karma.conf.js',
                                              action: 'run'
                                            }))
                                            .on('error', function(err) {
                                              // Make sure failed tests cause gulp to exit non-zero
                                              console.log(err);
                                            });
                                        });

                                        //--API Test-----------------------------------------------------------------------
                                        var mocha = require('gulp-mocha');
                                        gulp.task('test-backend', function () {
                                            return gulp.src(backendTestFiles)
                                                        .pipe(plumber())
                                                        .pipe(mocha());
                                        });

                                        //--Backend-Test Coverage Reports---------------------------------------------------
                                        var istanbul = require('gulp-istanbul');
                                        gulp.task('backend-coverage', function (cb) {
                                          gulp.src(['!server/**/*.spec.js','server/**/*.js'])
                                            .pipe(plumber())
                                            .pipe(istanbul()) // Covering files
                                            .pipe(istanbul.hookRequire()) // Force `require` to return covered files
                                            .on('finish', function () {
                                              gulp.src(['server/**/*spec.js'])
                                                  .pipe(mocha())
                                                  .pipe(istanbul.writeReports({reportOpts: { 
                                                      dir: './test_reports/unit_test_coverage/backend',
                                                  }})) // Creating the reports after tests ran
                                                  .on('end', function(){
                                                    console.log(chalk.green("Backend Test Coverage Report updated"));
                                                    
                                                  });
                                            });
                                        });
                                        //--Run the server to test the api--------------------------------------------------
                                        var server = require('gulp-express');
                                        gulp.task('test-server', function () {
                                          var options = {
                                            env:{
                                              PORT:8080 
                                            }
                                          }
                                          server.run(['server/server.js'],options);
                                        });

                                        // open the reports when tests are all completed
                                        var fronendReportHtml = path.join(__dirname,'test_reports/unit_test_coverage/frontend/report-html/index.html')
                                        var backendReportHtml = path.join(__dirname,'test_reports/unit_test_coverage/backend/lcov-report/index.html')
                                        gulp.task('open-reports', function(){
                                          console.log(fronendReportHtml);
                                          gulp.src([fronendReportHtml,backendReportHtml])
                                              .pipe(wait(1500))
                                              .pipe(open({app:openBrowserApp("osx-chrome")}));
                                        });



                                        //--ALL TESTS-----------------------------------------------------------------------
                                        // run all test and coverange reports
                                        var wait = require('gulp-wait');
                                        gulp.task('test', function(testdone) {
                                          runSequence(['test-frontend', 'test-backend','backend-coverage','open-reports','watch-tests'],
                                                      testdone);
                                        });
                                        function testdone(){console.log("reports and test are done!")}






















/**************************************************************************************/
/*          COMBO TASK                                                                */
/**************************************************************************************/
gulp.task('inject',   runSequence('cleanBowerTags','injectBowerTags','cleanClientTags','injectClientTags'));
gulp.task('serve',    runSequence('cleanBowerTags','injectBowerTags','cleanClientTags','injectClientTags','browser-sync'));
gulp.task('default',  runSequence('cleanBowerTags','injectBowerTags','cleanClientTags','injectClientTags'));