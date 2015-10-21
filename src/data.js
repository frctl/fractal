/**
 * Module dependencies.
 */

var yaml    = require('js-yaml');
var _       = require('lodash');

/*
 * Export the data object.
 */

module.exports = {

    /*
     * Extract data from a file object, optionally with a set of defaults applied.
     *
     * @api private
     */

    load: function(file, defaults){
        defaults = defaults || {};
        if (file) {
            var data = {};
            switch(file.ext) {
                case ".js":
                    data = require(file.absolutePath);
                    break;
                case ".json":
                    data = JSON.parse(file.contents);
                    break;
                case ".yml":
                case ".yaml":
                    data = yaml.safeLoad(file.contents);
                    break;
            }
            return _.defaultsDeep(data, defaults);
        }
        return {};
    }


};
