var express     = require('express');
var app         = express();
var path        = require('path');
 
var webDir = path.resolve(__dirname,"../www");
// console.log(webDir);
app.use(express.static(webDir));
app.use('/*', function(req, res){
  res.sendFile(path.join(webDir,'/index.html'));
});

app.listen(8080)

