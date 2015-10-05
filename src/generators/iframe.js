var _           = require('lodash');
var lz          = require('lz-string');

var config      = require("../config");

module.exports = function(hbs){

    return function(options) {
        var str = lz.compressToEncodedURIComponent(options.fn(this));
        return new hbs.SafeString('<iframe src="/_embed?content=' + str + '"></iframe>');
    };
    
};