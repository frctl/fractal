'use strict';

const co      = require('co');
const _       = require('lodash');
const context = require('./context');
const config  = require('../config');
const logger  = require('../logger');
const source  = require('../source');


let engine = null;
let viewsCache = null;

const loadViews = co.wrap(function* (){
    if (!viewsCache) {
        const components = yield source('components');
        const views = [];
        for (let comp of components.flatten()) {
            let defaultVariant = comp.getDefaultVariant();
            for (let variant of comp.variants) {
                views.push({
                    handle: `${comp.handle}${config.get('components.splitter')}${variant.handle}`,
                    alias: variant.handle === defaultVariant.handle ? comp.handle : null,
                    path: variant.path,
                    content: variant.viewContents
                });
            }
        }
        engine.registerViews(views);
        source.once('changed', (name) => {
            if (name === 'components'){
                viewsCache = null;
                console.log('CLEAR');
            }
        });
    }
    return viewsCache;
});

function getEngine(){
    if (engine) {
        return engine;
    }
    const moduleName = config.get('components.view.engine');
    try {
        engine = require(moduleName);
        engine.extend(config.get('components.view.extend'));
        return engine;
    } catch (e) {
        throw new Error(`The component view engine '${moduleName}' could not be loaded: ${e.message}`);
    }
}

module.exports = co.wrap(function* (entity, preview){
    if (entity.type === 'component') {
        entity = entity.getVariant();
    }
    const engine   = getEngine();
    const views    = yield loadViews();
    let rendered = engine.render(entity.viewContents, yield context(entity.context), {
        path: entity.viewPath
    });
    if (preview && entity.preview){
        const components = yield source('components');
        let layout =  components.find(entity.preview);
        if (!layout) {
            logger.error(`Preview layout ${entity.preview} for component ${entity._parent.handle} not found.`);
            return rendered;
        }
        if (layout.type === 'component') {
            layout = layout.getVariant();
        }
        const ctx = yield context(layout.context);
        ctx._variant = entity.toJSON();
        ctx[config.get('components.preview.yield')] = rendered;
        return engine.render(layout.viewContents, ctx, {
            path: entity.viewPath
        });
    }
    return rendered;
});
