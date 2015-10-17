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
        var parsed = matter(content);
        return {
            data: parsed.data,
            content: new Buffer(parsed.content.trim() + "\n", "utf-8")
        };
    }
};
