/**
 * Module dependencies.
 */

var path        = require('path');
var _           = require('lodash');
var consolidate = require('consolidate');

/*
 * Export the component renderer.
 */

module.exports = {

    /*
     * Render a variant using consolidate to provide some template-language independence.
     * Components are loaded in as partials, keyed by their handle.
     * Returns a promise.
     *
     * @api public
     */
     
    render: function(entity, context, app){
        if (entity.type == 'component') {
            entity = entity.getVariant();
        }
        var context = context || entity.context;

        // TODO: add helpers        

        return this.getPartials(entity.fsViewPath, app).then(function(partials){
            context.partials = partials;
            context.cache = false;
            return consolidate[entity.engine](entity.fsViewPath, context);
        });
    },

    /*
     * Render a variant within it's preview layout (if one is specified).
     * Returns a promise.
     *
     * @api public
     */
    
    renderPreview: function(entity, context, app){
        return this.render(entity, context, app).then(function(rendered){
            if (entity.preview) {
                return app.getComponents().then(function(components){
                    var layout = components.resolve(entity.preview);
                    var layoutContext = {
                        _variant: entity.toJSON(),
                        cache: false
                    };
                    layoutContext[app.get('components:preview:yield')] = rendered;
                    return layout.renderView(layoutContext, false);
                });
            }
            return rendered;
        });   
    },

    /*
     * Return an promise of an object of partials.
     *
     * Object return format
     * Key = partial name to use in templates
     * Value = path to the partial, relative to the view path
     *
     * @api public
     */

    getPartials: function(fsViewPath, app){
        return app.getComponents().then(function(components){
            var partials = {};
            _.each(components.flatten(), function(comp){
                var variants = comp.getVariants();
                _.each(variants, function(variant){
                    if (fsViewPath != variant.fsViewPath) {
                        var relPath = path.relative(fsViewPath, variant.fsViewPath).replace('../', '');
                        var parts = path.parse(relPath);
                        if ( !_.isEmpty(parts.name) && (path.extname(fsViewPath) == path.extname(variant.fsViewPath))) {
                            var key = comp.handle + '::' + variant.handle;
                            partials[key] = path.join(parts.dir, parts.name);            
                            if (variant.handle === comp._default.handle) {
                                partials[comp.handle] = partials[key];                
                            }
                        }
                    }
                });
            });
            return partials;
        });
    }

};
