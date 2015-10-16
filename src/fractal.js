/**
 * Module dependencies.
 */

var app = require("./application");

/**
 * Export boot() function.
 */

exports = module.exports = boot;

function boot(){
    app.init();
    return app;
};