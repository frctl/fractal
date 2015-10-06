var _           = require('lodash');
var lz          = require('lz-string');

var config      = require("../config");

module.exports = function(hbs){

    return function(options) {
        var layout = options.hash.layout || 0;
        var str = lz.compressToEncodedURIComponent(options.fn(this));
        return new hbs.SafeString('<iframe allowtransparency="true" src="/_embed?layout=' + layout + '&content=' + str + '" width="100%"></iframe>');
    };
    
};