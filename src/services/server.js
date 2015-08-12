var express = require('express');
var exphbs  = require('express-handlebars');
var path    = require('path');

module.exports = function(fractal){

    var app = express();
    var hbs = exphbs.create({
        extname: 'hbs',
        partialsDir: [
            fractal.theme.views
        ]
    });

    app.engine('hbs', hbs.engine);
    app.set('views', fractal.theme.views)
    app.set('view engine', 'hbs');

    app.get('/', function (req, res) {
        res.render('default', {
            content: 'Hello world!'
        });
    });

    app.use(express.static(fractal.theme.assets));

    app.listen(fractal.config.port, function () {
        console.log('Fractal server is running at http://localhost:%s', fractal.config.port);
    });

    return app;
};