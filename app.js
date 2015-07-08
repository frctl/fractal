var _ = require('lodash');
var Fractal = require('./app/fractal.js');

var frctl = Fractal(__dirname + '/src');
var tree = frctl.build();

tree.then(function(files){
    
    // console.log(_.filter(files, function(file){
    //     return file.isComponent;
    // }));

    frctl.exportComponents(__dirname + '/build', files);

});