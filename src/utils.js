/**
 * Module dependencies.
 */

var _       = require('lodash');
var matter  = require('gray-matter');

/*
 * Export the utilities.
 */

module.exports = {

    /*
     * Convert a string to Start Case.
     *
     * @api public
     */

    titlize: function(str){
        return _.startCase(str);
    },

    /*
     * Parse a string (or Buffer) to split into front matter (if any) and body content.
     *
     * @api public
     */

    parseFrontMatter: function(str){
        str = _.isObject(str) ? str.toString() : str;
        var parsed = matter(str);
        return {
            data: parsed.data || {},
            body: new Buffer(parsed.content.trim() + "\n", "utf-8")
        };
    },

    fauxPath: function(path){
        return _.map(path.split('/'), function(segment){
            return segment.replace(/^_/,'').replace(/^\d+\-/, '');
        }).join('/');    
    },

    httpError: function(msg, status){
        var e = new Error(msg);
        e.status = status || 500;
        return e;
    }
    
};
