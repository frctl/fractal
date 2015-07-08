var Fractal = require('./app/fractal.js');

var build = Fractal('src').build();

build.then(function(files){
    // console.log(files);
});