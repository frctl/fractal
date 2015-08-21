var fractal = require('../../fractal');
var config  = fractal.getConfig();
var path = require('path');
var fs = require('fs');

module.exports = function(){

    fractal.getSources().then(function(sources){
        var output = JSON.stringify(sources.docs, null, 4)
        fs.writeFile(path.join(__dirname, "/output.json"), output, function(err) {
          console.log('file saved');
        }); 
    });
};