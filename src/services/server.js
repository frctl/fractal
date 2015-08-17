var promise = require("bluebird");
var merge   = require("deepmerge");
var express = require('express');
var exphbs  = require('express-handlebars');
var path    = require('path');
var swag    = require('swag');
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
    
    swag.registerHelpers(hbs.handlebars);
    
    app.engine('hbs', hbs.engine);
    app.set('views', config.get('theme.views'))
    app.set('view engine', 'hbs');

    app.use(express.static(config.get('theme.assets')));
    
    app.get('/', function (req, res) {
        render('default', {
            title: 'Overview'
        }, res);
    });

    app.listen(port, function () {
        console.log('Fractal server is running at http://localhost:%s', port);
    });
    
    return app;
};

function render(tpl, tplData, res){
    fractal.getData().then(function(data){
        res.render(tpl, merge({
            data: data
        }, tplData));
    });
}