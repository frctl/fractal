var _           = require('lodash');
var path        = require("path");
var fractal     = require("../../fractal");
var fs          = require("fs");

var config      = require("../config");

module.exports = function(hbs){

    var componentTemplate = hbs.compile(fs.readFileSync(path.join(config.get('theme.views'),'generators/component.hbs'), 'utf8'));

    return fractal.getSources().then(function(sources){
        return function(component) {
            
          
                return new hbs.SafeString('fooi');
            

            
        };
    });
};