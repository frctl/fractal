var express = require('express');
var exphbs  = require('express-handlebars');
var path    = require('path');
var fractal = require('../../fractal');
var config  = fractal.getConfig();

module.exports = function(){
    var port = config.get('port');
    var app = express();
    var hbs = exphbs.create({
        extname: 'hbs',
        partialsDir: [
            config.get('theme.views')
        ]
    });

    app.engine('hbs', hbs.engine);
    app.set('views', config.get('theme.views'))
    app.set('view engine', 'hbs');

    fractal.getComponents().then(function(components){
        console.log(components);
    });

    app.get('/', function (req, res) {
        res.render('default', {
            content: 'Hello world!'
        });
    });

    app.use(express.static(config.get('theme.assets')));

    // app.listen(port, function () {
    //     console.log('Fractal server is running at http://localhost:%s', port);
    // });

    return app;
};