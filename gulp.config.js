var path   			= require("path");




/**************************************************************************************/
/*          FRONTEND                                                                  */
/**************************************************************************************/
// FRONTEND
var indexHtml       = path.join(__dirname,'www','index.html');
var webAppPath      = path.join('www','app');
var frontendFiles 	= [
	'www/*.html',
	path.join(webAppPath, '*.html'),
	path.join(webAppPath, 'css/*.css'),
	path.join(webAppPath, 'js/*.js'),
	path.join(webAppPath, '**/*.html'),
	path.join(webAppPath, 'css/**/*.css'),
	path.join(webAppPath, 'js/**/*.js'),
	path.join("!", webAppPath, 'js/*.spec.js'),
	path.join("!", webAppPath, 'js/**/*.spec.js')
];
var frontendTestFiles = [
    path.join(webAppPath, 'js/*.js'),
    path.join(webAppPath, 'js/**/*.js'),
    path.join(webAppPath, '*.html'),
    path.join(webAppPath, '**/*.html')   
];




/**************************************************************************************/
/*          BACKEND                                                                   */
/**************************************************************************************/
var serverDirPath   = path.join(__dirname,"server");
var serverFilePath  = path.join(serverDirPath,'server.js');
var backendFiles = [
  path.join(serverDirPath,'db/*.js'),
  path.join(serverDirPath,'middleware/*.js'),
  path.join(serverDirPath,'models/*.js'),
  path.join(serverDirPath,'routes/*.js'),
  path.join(serverDirPath,'services/*.js'),
  path.join(serverDirPath,'*.js'),
];
var backendTestFiles = [
  path.join(serverDirPath,'db/*.spec.js'),
  path.join(serverDirPath,'middleware/*.spec.js'),
  path.join(serverDirPath,'models/*.spec.js'),
  path.join(serverDirPath,'routes/*.spec.js'),
  path.join(serverDirPath,'services/*.spec.js'),
  path.join(serverDirPath,'*.spec.js'),
];




/**************************************************************************************/
/*          BOWER                                                                     */
/**************************************************************************************/
var mainBowerFiles  = require('main-bower-files');
var bowerPath		= path.join('www','bower_components');
var bowerFiles 		= mainBowerFiles('**/*.js');	
for (var i in bowerFiles) {
	var relPath = path.resolve(bowerFiles[i].replace(__dirname,"")).substring(1);
	bowerFiles[i] = relPath;
}
var appFiles 	= [
    path.join(webAppPath, 'js/*.js'),
    path.join(webAppPath, 'js/**/*.js'),
    path.join(webAppPath, '*.html'),
    path.join(webAppPath, '**/*.html'),    
];
var allFiles = bowerFiles.concat(appFiles)






/**************************************************************************************/
/*          NODEJS EXPORTS                                                            */
/**************************************************************************************/
module.exports 	= {
	karma : {
		files: allFiles,
		exclude: [],
		serverIntegrationSpecs: ""
	},
	frontend: {
		index: indexHtml,
		files: frontendFiles,
		testFiles:frontendTestFiles
	},
	backend :{
		files: backendFiles,
		testFiles: backendTestFiles
	}
}