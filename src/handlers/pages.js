/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');

var md          = require('../markdown');
var renderer    = require('../views/renderer');
var RenderError  = require('../errors/render');

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
        try {
            return Promise.resolve(md(pageRenderer.renderString(page._content, context)));
        } catch(e) {
            throw new RenderError('Could not render page "' + page.path + '". There may be a syntax error.', e);
        }
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
