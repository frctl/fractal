var express = require('express');
var app = express();

module.exports = function(config, files){

    app.get('/', function (req, res) {
        res.send('<p><strong>Fractal</strong> is up and running!</p>');
    });

    app.listen(config.port, function () {
        console.log('Fractal server is running at http://localhost:%s', config.port);
    });

    return app;
};