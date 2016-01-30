'use strict';

const co     = require('co');
const config = require('../config');
const logger = require('../logger');
const source = require('../source');

const handler = null;
const viewsCache = null;

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
                    content: variant.files.view.getContents() // TODO: Give variants files
                });
            }
        }
        handler.registerViews(views);
        source.once('changed', (name) => {
            if (name === 'components'){
                viewsCache = null;
                console.log('CLEAR');
            }
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

module.exports = co.wrap(function* (variant, preview){
    const handler = getHandler();
    const views   = yield loadViews();

    // TODO

    const rendered = handler.render(file, context, {
        path: variant.viewPath // TODO: do we need this??
    });
    if (preview){
        const components = yield source('components');
    }
});
