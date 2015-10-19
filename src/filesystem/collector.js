/**
 * Module dependencies.
 */

var _ = require('lodash');

/*
 * Export the collector object.
 */

module.exports = {

    collectFiles: function(files, config, replacements){
        var ret = {};
        _.each(config, function(definition, key){
            var item = _.clone(definition);
            item.matched = _.filter(files, function(entity){
                return (entity.isFile() && entity.matches(item.matches, replacements));
            });
            if (key == 'preview' || !item.multiple) {
                item.matched = _.first(item.matched) || null;
            }
            if (_.isArray(item.matched) && ! item.matched.length) {
                item.matched = null;    
            }
            ret[key] = item;
        });
        return ret;
    }

};