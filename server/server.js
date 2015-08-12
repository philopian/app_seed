var argv 		= require('minimist')(process.argv.slice(2));
var path 		= require('path');
var express 	= require('express');
var bodyParser 	= require('body-parser');
var favicon 	= require('serve-favicon');

var config 		= require('./services/config');
var www 		= require('./routes/www')
var apiRoute 	= require('./routes/api');
// var logging 	= require('./services/logging');
// var logger 		= logging.logger;


var app = express();




/******** Middleware *************************************/
var faviconUrl = path.resolve(__dirname, "../favicon.ico");
app.use(favicon(faviconUrl));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('X-Powered-By', 'The Stacker');
  next();
})



/******** API Calls	**************************************/
var api = new express.Router();
api.use(bodyParser.json());
app.use('/api/', api);
api.get('/test',apiRoute.test)


/******** All other routes redirect to angularjs  ********/
var clientPath = path.resolve(__dirname, '../www');
app.use(express.static(clientPath));
app.all('/*', www.dev);


/******** Listen on a port	*****************************/
var port = argv.port || process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Starting application on port: ' + port);
  // logger.log('info', 'Starting application on port: ' + port);
});