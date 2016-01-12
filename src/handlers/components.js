/**
 * Module dependencies.
 */

var path        = require('path');
var _           = require('lodash');
var consolidate           = require('consolidate');
var RenderError  = require('../errors/render');
var NotFoundError  = require('../errors/notfound');
var app         = require('../application');

var engine = app.get('components:engine');

var partials = null;

try {
    var renderer = require(engine.handler);
} catch (e) {
    try {
        var renderer = require(path.join(app.get('system:paths:root'), engine.handler));
    } catch (e) {
        console.log(e)
        console.log(path.join('../../../', engine.handler))
        throw new NotFoundError('The component handler ' + engine.handler + ' could not be found.');
    }
}

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

    render: function(entity, context){

        try {
            if (entity.type == 'component') {
                entity = entity.getVariant();
            }
            var context = _.cloneDeep(context || entity.context);

            if (!partials) {
                partials = this.fetchPartials().then(function(partials){
                    renderer.addPartials(partials);
                });
                app.events.once('component-tree-changed', function(){
                    partials = null;
                });
            }

            return partials.then(function(){
                return renderer.render(entity.files.view.getContents(), context);
            });
        } catch(e) {
            throw new RenderError('Could not render component "' + entity.handlePath + '".', e);
        }
    },

    /*
     * Render a variant within it's preview layout (if one is specified).
     * Returns a promise.
     *
     * @api public
     */

    renderPreview: function(entity, context){
        return this.render(entity, context).then(function(rendered){
            if (entity.preview) {
                return app.getComponents().then(function(components){
                    var layout = components.resolve(entity.preview);
                    var layoutContext = {
                        _variant: entity.toJSON(),
                    };
                    layoutContext[app.get('components:preview:yield')] = rendered;
                    return layout.renderView(layoutContext, false);
                });
            }
            return rendered;
        });
    },

    fetchPartials: function(){
        return app.getComponents().then(function(components){
            var partials = [];
            _.each(components.flatten().components, function(comp){
                var variants = comp.getVariants();
                _.each(variants, function(variant){
                    partials.push({
                        handle: comp.handle + ':' + variant.handle,
                        alias: variant.handle === comp.default.handle ? comp.handle : null,
                        path: variant.fsViewPath,
                        content: variant.files.view.getContents()
                    });
                });
            });
            return partials;
        });
    }

};
