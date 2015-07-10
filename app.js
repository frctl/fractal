var _ = require('lodash');
var Fractal = require('./app/fractal.js');
var express = require('express');
var watch = require('watch');

var app = express();
var frctl = Fractal(__dirname + '/src');
var tree = frctl.build();

tree.then(function(files){
    
    // console.log(_.filter(files, function(file){
    //     return file.isComponent;
    // }));

    frctl.exportComponents(__dirname + '/build', files);

});

tree.then(function(files){

    watch.watchTree(__dirname + '/src', function (f, curr, prev) {
        if (typeof f == "object" && prev === null && curr === null) {
          // Finished walking the tree
        } else {
            // hacky POC for rebuilding tree
            console.log(f);
            // frctl.build().then(function(res){
            //     files = res;
            // });
        }
    });

    app.get('/', function (req, res) {

        res.json(files);
    });
    
    var server = app.listen(3000, function () {

        var port = server.address().port;

        console.log('Example app listening on port %s', port);

    });

});

