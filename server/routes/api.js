



module.exports = {

    test: function(req, res) {
      var sendTestMessage = {
      	hello:"world"
      };
      res.status(200).json(sendTestMessage); 
    },


}