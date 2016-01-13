/**
 * Module dependencies.
 */

var _           = require('lodash');
var matter      = require('gray-matter');

/*
 * Export the mixin.
 */

module.exports = entity;


function entity(){
    
    /*
     * Get a static, JSON-style object representation of the entity.
     * Good for using with templating languages.
     *
     * @api public
     */

    this.toJSON = function(){
        var obj = {};
        _.forOwn(this, function(value, key){
            if (!_.startsWith(key, '_')) {
                if (value && typeof value.toJSON === 'function') {
                    obj[key] = value.toJSON();
                } else {
                    obj[key] = value;    
                }
            }
        });
        return obj;
    };

    /*
     * Get a JSON-formatted string representation of the entity.
     *
     * @api public
     */

    this.toString = function(){
        return JSON.stringify(this.toJSON(), null, 4);
    };

};

