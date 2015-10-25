/**
 * Module dependencies.
 */

var app = require("./application");
var data = require("./data");

/**
 * Export boot() function.
 */

exports = module.exports = fractal;

function fractal(){
    app.init();
    return app;
};

fractal.data = {
    load: function(path){
        return {
            foo: 'bar'
        }
    }
};