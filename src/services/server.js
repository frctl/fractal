var express = require('express');
var app = express();

module.exports = function(config){

    app.get('/', function (req, res) {
        res.send('Fractal is up and running!');
    });

    app.listen(config.port, function () {
        console.log('Fractal server is running at http://localhost:%s', config.port);
    });

    return app;
};