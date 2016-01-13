/**
 * Module dependencies.
 */

var path          = require('path');
var logger        = require('winston');
var _             = require('lodash');
var RenderError   = require('../errors/render');
var NotFoundError = require('../errors/notfound');
var app           = require('../application');

var renderer;
var engineConf    = app.get('components:view:engine');
var viewsCache    = null;

try {
    engine = require(engineConf.handler);
} catch (e) {
    try {
        engine = require(path.join(app.get('system:paths:root'), engineConf.handler));
    } catch (e) {
        logger.warn(e.message);
        throw new NotFoundError('The component handler ' + engineConf.handler + ' could not be found.');
    }
}

engine.init(engineConf);

/*
 * Export the component handler.
 */

module.exports = {

    /*
     * Render a variant using the specified rendering engine.
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
            return this.loadViews().then(function(){
                return engine.render(entity.files.view.getContents(), context, {
                    path: entity.fsViewPath
                });
            }).catch(function(e){
                throw new RenderError('Could not render component "' + entity.handlePath + '".', e);
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

    loadViews: function(){
        if (viewsCache) {
            return viewsCache;
        } else {
            viewsCache = app.getComponents().then(function(components){
                var views = [];
                _.each(components.flatten().components, function(comp){
                    var variants = comp.getVariants();
                    _.each(variants, function(variant){
                        views.push({
                            handle: comp.handle + ':' + variant.handle,
                            alias: variant.handle === comp.default.handle ? comp.handle : null,
                            path: variant.fsViewPath,
                            content: variant.files.view.getContents()
                        });
                    });
                });
                return views;
            }).then(function(views){
                engine.registerViews(views);
                app.events.once('component-tree-changed', function(){
                    viewsCache = null;
                });
            });
            return viewsCache;
        }
    }

};
