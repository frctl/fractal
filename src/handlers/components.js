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
     
    render: function(entity, context, app){
        if (entity.type == 'component') {
            entity = entity.getVariant();
        }
        var context = context || entity.defaultContext;

        // TODO: add helpers
        // TODO: add partials
        // 
        return consolidate[entity.engine](entity.viewPath, context).then(function(rendered){
            if (variant.preview) {
                var components = app.getComponents().value();
                var layout = components.resolve(variant.preview);
                if (layout) {
                    
                    // context[app.get('components:layout:yield')] = rendered;
                    // return layout.renderView();
                }
            }
            return rendered;
        });
    }

};
