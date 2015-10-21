/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var marked      = require('marked');

/*
 * Export the handlebars renderer object.
 */

module.exports = {

    /*
     * Render a string asyncronously.
     *
     * @api public
     */

    render: function(page, app){
        return Promise.resolve(marked(page.getContents()));
    }

};
