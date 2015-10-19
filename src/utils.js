/**
 * Module dependencies.
 */

var _       = require('lodash');
var matter  = require('gray-matter');

/*
 * Export the utilities.
 */

module.exports = {

    titlize: function(str){
        return _.startCase(str);
    },

    parseFrontMatter: function(content){
        content = _.isObject(content) ? content.toString() : content;
        var parsed = matter(content);
        return {
            data: parsed.data || {},
            body: new Buffer(parsed.content.trim() + "\n", "utf-8")
        };
    }
};
