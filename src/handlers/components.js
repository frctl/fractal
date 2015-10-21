/**
 * Module dependencies.
 */

var path        = require('path');
var consolidate = require('consolidate');

/*
 * Export the component renderer.
 */

module.exports = {

    /*
     * Render a template using the consolidate library.
     * Returns a promise.
     *
     * @api public
     */
     
    render: function(variant, app){
        var viewPath = path.join(app.get('components:path'), variant.path, variant.view);
        // TODO: add helpers
        // TODO: add partials
        return consolidate[variant.engine](viewPath, variant.context);
    }

};
