/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');

var md          = require('../markdown');
var renderer    = require('../view');
var RenderError = require('../errors/render');
var app         = require('../application');

/*
 * Export the page handler object.
 */

module.exports = {

    /*
     * Render a page.
     *
     * @api public
     */

    render: function(page, context){
        var pageRenderer = renderer(app.get('theme:paths:views'));
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

    renderString: function(str, context){
        var pageRenderer = renderer(app.get('theme:paths:views'));
        return Promise.resolve(md(pageRenderer.renderString(page._content, context)));
    }

};
