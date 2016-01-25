/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');

var md          = require('../markdown');
var theme       = require('../theme/theme');
var engine      = require('../view');
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
        try {
            return Promise.resolve(md(engine.renderString(page._content, context || {})));
        } catch(e) {
            throw new RenderError('Could not render page "' + page.path + '". There may be a syntax error.', e);
        }
    }

};
