var gulp = require('gulp');
var fs   = require('fs');
var path = require('path');


/**************************************************************************************/
/*          GULP PLUGINS                                                              */
/**************************************************************************************/
var mainBowerFiles  = require('main-bower-files');
var inject          = require("gulp-inject");
var replace         = require('gulp-replace');
var chalk           = require('chalk');
var runSequence     = require('run-sequence');
var nodemon         = require('gulp-nodemon');
var open            = require('gulp-open');
var plumber         = require('gulp-plumber');
var browserSync     = require('browser-sync');
var reload          = browserSync.reload;







/**************************************************************************************/
/*          FILE PATHS                                                                */
/**************************************************************************************/
var indexFile = './www/index.html';
var watchAllFrontendFiles = [
  'www/app/js/*.js',
  'www/app/css/*.css',
  'www/app/**/*.css',
  'www/app/*.html',
  'www/*.html'
];
var serverDirPath   = path.join(__dirname,"server");
var serverFilePath  = path.join(serverDirPath,'server.js');
var backendFiles = [
  path.join(serverDirPath,'db/*.js'),
  path.join(serverDirPath,'middleware/*.js'),
  path.join(serverDirPath,'models/*.js'),
  path.join(serverDirPath,'routes/*.js'),
  path.join(serverDirPath,'services/*.js'),
  path.join(serverDirPath,'*.js'),
]







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
            .src([indexFile])
            .pipe(plumber())
            .pipe(replace(regexBowerCss, cleanBowerCss))
            .pipe(replace(regexBowerJs, cleanBowerJs))
            .pipe(gulp.dest('./www/'))
});
gulp.task('injectBowerTags', function () {
    return gulp
            .src(indexFile)
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
            .src([indexFile])
            .pipe(replace(regexInjectCss, cleanInjectCss))
            .pipe(replace(regexInjectJs, cleanInjectJs))
            .pipe(gulp.dest('./www/'));
});
gulp.task('injectClientTags', function () {
    var filterDevContent = [
        './www/app/js/*.js',
        '!./www/app/js/*.spec.js',
        './www/app/css/*.css'
    ];
    return gulp
            .src(indexFile)
            .pipe(plumber())
            .pipe(inject(gulp.src(filterDevContent, {read: false})))
            .pipe(replace('/www/', ''))
            .pipe(gulp.dest('./www'))
});








/**************************************************************************************/
/*          WATCH                                                                     */
/**************************************************************************************/





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
// we'd need a slight delay to reload browsers, connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;
gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'server/server.js',

    // watch core server file(s) that require server restart on change
    watch: backendFiles
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
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
    files: watchAllFrontendFiles,

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:8080',

    // Stop the browser from automatically opening
    open: false,  // "local", "external", "ui", "tunnel"

    // Don't show any notifications in the browser.
    notify: false, // will remove the small notification message in the browser

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    // port: 4000,

    // open the proxied app in chrome
    browser: openBrowserApp("osx-chrome")
  });
});












/**************************************************************************************/
/*          TESTING                                                                   */
/**************************************************************************************/

  // NEEED TO MOLD TO THIS APP
                                        /**/
                                        // //--Frontend Test-----------------------------------------------------------------------
                                        // var karma       = require('gulp-karma');
                                        // gulp.task('test-frontend', function() {
                                        //   // Be sure to return the stream
                                        //   return gulp.src(frontendTestFiles)
                                        //     .pipe(plumber())
                                        //     .pipe(karma({
                                        //       configFile: 'karma.conf.js',
                                        //       action: 'watch'
                                        //     }))
                                        //     .on('error', function(err) {
                                        //       // Make sure failed tests cause gulp to exit non-zero
                                        //       console.log(err);
                                        //     });
                                        // });
                                        // gulp.task('test-frontend-once', function() {
                                        //   // Be sure to return the stream
                                        //   return gulp.src(frontendTestFiles)
                                        //     .pipe(plumber())
                                        //     .pipe(karma({
                                        //       configFile: 'karma.conf.js',
                                        //       action: 'run'
                                        //     }))
                                        //     .on('error', function(err) {
                                        //       // Make sure failed tests cause gulp to exit non-zero
                                        //       console.log(err);
                                        //     });
                                        // });

                                        // //--API Test-----------------------------------------------------------------------
                                        // var mocha = require('gulp-mocha');
                                        // gulp.task('test-backend', function () {
                                        //     return gulp.src(backendTestFiles)
                                        //                 .pipe(plumber())
                                        //                 .pipe(mocha());
                                        // });

                                        // //--Backend-Test Coverage Reports---------------------------------------------------
                                        // var istanbul = require('gulp-istanbul');
                                        // gulp.task('backend-coverage', function (cb) {
                                        //   gulp.src(['!server/**/*.spec.js','server/**/*.js'])
                                        //     .pipe(plumber())
                                        //     .pipe(istanbul()) // Covering files
                                        //     .pipe(istanbul.hookRequire()) // Force `require` to return covered files
                                        //     .on('finish', function () {
                                        //       gulp.src(['server/**/*spec.js'])
                                        //           .pipe(mocha())
                                        //           .pipe(istanbul.writeReports({reportOpts: { 
                                        //               dir: './test_reports/unit_test_coverage/backend',
                                        //           }})) // Creating the reports after tests ran
                                        //           .on('end', function(){
                                        //             console.log(chalk.green("Backend Test Coverage Report updated"));
                                                    
                                        //           });
                                        //     });
                                        // });
                                        // //--Run the server to test the api--------------------------------------------------
                                        // var server = require('gulp-express');
                                        // gulp.task('test-server', function () {
                                        //   var options = {
                                        //     env:{
                                        //       PORT:8080 
                                        //     }
                                        //   }
                                        //   server.run(['server/server.js'],options);
                                        // });

                                        // // open the reports when tests are all completed
                                        // var fronendReportHtml = path.join(__dirname,'test_reports/unit_test_coverage/frontend/report-html/index.html')
                                        // var backendReportHtml = path.join(__dirname,'test_reports/unit_test_coverage/backend/lcov-report/index.html')
                                        // gulp.task('open-reports', function(){
                                        //   console.log(fronendReportHtml);
                                        //   gulp.src([fronendReportHtml,backendReportHtml])
                                        //       .pipe(wait(1500))
                                        //       .pipe(open({app:openBrowserApp("osx-chrome")}));
                                        // });



                                        // //--ALL TESTS-----------------------------------------------------------------------
                                        // // run all test and coverange reports
                                        // var wait = require('gulp-wait');
                                        // gulp.task('test', function(testdone) {
                                        //   runSequence(['test-frontend', 'test-backend','backend-coverage','open-reports','watch-tests'],
                                        //               testdone);
                                        // });
                                        // function testdone(){console.log("reports and test are done!")}










/**************************************************************************************/
/*          BUILD DIST                                                                */
/**************************************************************************************/

var clean             = require('gulp-clean');
var rename            = require("gulp-rename");
var concat            = require('gulp-concat')
var minifyCSS         = require('gulp-minify-css');
var mainBowerFiles    = require('main-bower-files')
var gulpFilter        = require('gulp-filter');
var order             = require('gulp-order')
var uglifycss         = require('gulp-uglifycss');
var stripCssComments  = require('gulp-strip-css-comments');
var minifyCss         = require('gulp-minify-css');
var uglify            = require('gulp-uglify');
var flatten           = require('gulp-flatten');
var minifyHTML        = require('gulp-minify-html')
var htmlreplace       = require('gulp-html-replace');
// var ngAnnotate        = require('gulp-ng-annotate');
// var minifyInline = require('gulp-minify-inline');

//--BUILD TASKES---------------------------------------------------------------------------

gulp.task('dist-clean', function() {
    // start a new dist folder from scratch
    return gulp.src('./dist/*')
        .pipe(clean({force: true}));
});

gulp.task('concateCss', function() {
  //--Create app's css (take all the .css files and make one files called ./dist/app/app.css)
    return gulp.src([
        './www/app/css/*.css',
        './www/app/css/**/*.css'
      ])
      .pipe(concat('app.css'))
      .pipe(minifyCSS())
      .pipe(gulp.dest('./dist/css/'));
});

gulp.task('buildCssVendors', function() {
    // Bower CSS - create a vendors.css file
    var bowerOptions = {
        paths: {
            bowerrc: '.bowerrc'
        }
    }
    var regexRemoveCss    = /\/\*!([\s\S]*?)\*\//g;
    var cleanAddCss       = '';
    var cssFiles = 'www/bower_components/*';
    return gulp.src(mainBowerFiles(bowerOptions))
                .pipe(gulpFilter('*.css'))
                .pipe(order([
                    'normalize.css',
                    '*'
                ]))
                .pipe(concat('vendors.css'))
                .pipe(stripCssComments())
                .pipe(replace(regexRemoveCss, cleanAddCss))
                .pipe(uglifycss())
                // .pipe(minifyCss())
                .pipe(gulp.dest('./dist/css'));
});

gulp.task('fonts', function() {
        var fontFilter  = gulpFilter(['*.eot', '*.woff', '*.woff2', '*.svg', '*.ttf']);
        return gulp.src(mainBowerFiles())
        .pipe(fontFilter)
        .pipe(flatten())
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('buildJsVendors', function() {
// Bower JS - create a vendors.js file
  var jsFiles = ['/www/bower_components/*'];
  var regexRemoveCss    = /\/\*!([\s\S]*?)\*\//g;
  var cleanAddCss       = '';
    return gulp.src(mainBowerFiles().concat(jsFiles))
        .pipe(gulpFilter('*.js'))
        .pipe(concat('vendors.js'))
        .pipe(replace(regexRemoveCss, cleanAddCss))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('buildJs', function() {
  //--Create app's css (take all the .css files and make one files called ./dist/app/app.css)
    return gulp.src([
        './www/app/js/*.js',
        './www/app/js/**/*.js'
      ])
      .pipe(concat('app.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js/'));
});

gulp.task('buildIndexHtml', function() {
// Remove the injected dependencies (Remove all the bower:css/endinject, inject:css/endinject, bower:js/endinject, inject:js/endinject)
    var opts = {
        comments:true,
        spare:true,
        empty:true
    };

    // regex pattern
    var regexInjectTags = /<!-- inject:([\s\S]*?)<!-- endinject -->/g;
    var regexBowerTags = /<!-- bower:([\s\S]*?)<!-- endinject -->/g

    return gulp.src(indexFile)
        .pipe(htmlreplace({
            'css': ['<link rel="stylesheet" href="./css/vendors.css">','<link rel="stylesheet" href="./css/app.css">'] ,
            'js':  ['<script src="./js/vendors.js"></script>','<script src="./js/app.js"></script>']
        }))
        .pipe(replace(regexInjectTags, ''))
        .pipe(replace(regexBowerTags, ''))
        // .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copyassets',function(){
  var files =[
    './www/assets/*',
    './www/assets/**/*'
  ]
  return gulp.src(files)
    .pipe(gulp.dest('./dist/assets'));
});

// gulp.task('copyVendorImages',function(){
//   var files = ['www/bower_components/**/dist/images/*']
//   return gulp.src(files)
//     .pipe(flatten())
//     .pipe(gulp.dest('./dist/app/css/images'));
// });

gulp.task('copyfavicon',function(){
  return gulp.src('favicon.ico')
    .pipe(gulp.dest('./dist'));
});


//--BUILD-----------------------------------------------------------------------
// * build-clean
// * css base.css
// * css app.css
// * build vendors.css from all bower dependencies
// * build vendors.js from all bower dependencies
// * copy fonts from font-awesome/boostrap
gulp.task('build', function() {
    runSequence(
        'dist-clean',
        [
            'concateCss',
            'buildCssVendors',
            'fonts',
            'buildJsVendors',
            'buildJs',
            'copyassets',
            'copyfavicon'
        ],
        'buildIndexHtml'
        );
});










/**************************************************************************************/
/*          COMBO TASK                                                                */
/**************************************************************************************/
gulp.task('serve',    function() {
    runSequence('cleanBowerTags','injectBowerTags','cleanClientTags','injectClientTags','browser-sync')
});
gulp.task('default',  function() {
    runSequence('cleanBowerTags','injectBowerTags','cleanClientTags','injectClientTags','browser-sync')
});
gulp.task('build', function() {
    runSequence(
        'dist-clean', [
           'concateCss',
            'buildCssVendors',
            'fonts',
            'buildJsVendors',
            'buildJs',
            'copyassets',
            'copyfavicon'
        ],
        'buildIndexHtml'
        );
});
