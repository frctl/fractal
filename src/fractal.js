/**
 * Module dependencies.
 */

var app = require("./application");
var data = require("./data");

module.exports = (function(){
    app.init();
    return app;
})();
