var fractal = require('../../fractal');
var config  = fractal.getConfig();
var path = require('path');
var fs = require('fs');

module.exports = function(){

    fractal.getStructure().then(function(structure){

        var output = JSON.stringify(structure, null, 4)
        // console.log(output);
        
        fs.writeFile(path.join(__dirname, "/output.json"), output, function(err) {
          console.log('file saved');
        }); 
    });
};