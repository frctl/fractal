'use strict';

const co     = require('co');
const config = require('../config');
const logger = require('../logger');
const source = require('../source');

const handler = null;
const viewsCache = null;

var engine = function(str, context, preview){
    context = context || {};
    preview = preview || null;
    const handler = getHandler();
    try {
        return this.loadViews().then(function(){
            return engine.render(entity.files.view.getContents(), context, {
                path: entity.fsViewPath
            });
        }).catch(function(e){
            throw new Error(`Template render error`, e);
        });
    } catch(e) {
        throw new Error(`Template render error`, e);
    }
};

const loadViews = co(function* (){
    if (!viewsCache) {
        const components = yield source(app.get('components.path'), 'components');
        const views = [];
        _.each(components.flatten(), function(comp){
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


        }).then(function(views){
            engine.registerViews(views);
            app.events.once('component-tree-changed', function(){
                viewsCache = null;
            });
        });
    }
    return viewsCache;
});

function getHandler(){
    if (handler) {
        return handler;
    }
    try {
        const moduleName = config.get('components.view.engine');
        handler = require(moduleName);
        handler.extend(config.get('components.view.extend'));
        return handler;
    } catch (e) {
        throw new Error(`The component view engine '${moduleName}' could not be loaded: ${e.message}`);
    }
}

function render(){

}



module.exports = engine;
