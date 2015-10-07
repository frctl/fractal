var _           = require('lodash');
var lz          = require('lz-string');
var path        = require("path");
var fs          = require("fs");

var config      = require("../config");

module.exports = function(hbs){

    var previewTemplate = hbs.compile(fs.readFileSync(path.join(config.get('theme.views'),'generators/preview.hbs'), 'utf8'));

    return function(options) {
        var layout = options.hash.layout || 0;
        var content = lz.compressToEncodedURIComponent(options.fn(this));
        return new hbs.SafeString(previewTemplate({
            layout: layout,
            content: content,
        }));
    };
    
};