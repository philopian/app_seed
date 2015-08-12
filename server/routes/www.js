var path 		= require('path');

var devPath 	= path.resolve(__dirname, '../../www');
var distPath 	= path.resolve(__dirname, '../../dist');

module.exports = {

	dev : function(req, res){
		res.sendFile(devPath+'/index.html');
	},
	dist : function(req, res){
		res.sendFile(distPath+'/index.html');
	}

}//module.exports