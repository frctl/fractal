/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');

var md          = require('../markdown');
var renderer    = require('../views/renderer');

/*
 * Export the page renderer object.
 */

module.exports = {

    /*
     * Render a page.
     *
     * @api public
     */

    render: function(page, context, app){
        var pageRenderer = renderer(app.get('theme:paths:views'), app);
        var context = _.defaultsDeep({
            page: page.toJSON()
        }, context || {});
        return Promise.resolve(md(pageRenderer.renderString(page._content, context)));
    },

    /*
     * Render a string.
     *
     * @api public
     */

    renderString: function(str, context, app){
        var pageRenderer = renderer(app.get('theme:paths:views'), app);
        return Promise.resolve(md(pageRenderer.renderString(page._content, context)));
    }

};
