'use strict';

const co      = require('co');
const _       = require('lodash');
const context = require('./context');
const config  = require('../config');
const logger  = require('../logger');
const source  = require('../source');

let engine       = null;
let viewsLoaded  = false;
const moduleName = config.get('components.view.engine');

try {
    engine = require(moduleName);
    engine.extend(config.get('components.view.extend'));
} catch (e) {
    throw new Error(`The component view engine '${moduleName}' could not be loaded: ${e.message}`);
}

function loadViews() {
    return source('components').then(components => {
        const views = [];
        for (let comp of components.flatten()) {
            let defaultVariant = comp.getDefaultVariant();
            for (let variant of comp.variants) {
                views.push({
                    handle: variant.ref,
                    alias: variant.handle === defaultVariant.handle ? comp.handle : null,
                    path: variant.path,
                    content: variant.viewContents
                });
            }
        }
        engine.registerViews(views);
        return views;
    });
};

source.on('loaded', name => {
    if (name === 'components') {
        viewsLoaded = loadViews();
    }
});

module.exports = co.wrap(function* (entity, preview) {
    viewsLoaded = yield loadViews();
    const variant = entity.getVariant();
    if (viewsLoaded !== false) yield viewsLoaded;
    let rendered = engine.render(variant.viewContents, yield context(variant.context), {
        path: variant.viewPath
    });
    if (preview && variant.preview) {
        const components = yield source('components');
        let layout = components.find(variant.preview);
        if (!layout) {
            logger.error(`Preview layout ${variant.preview} for component ${variant._parent.handle} not found.`);
            return rendered;
        }
        layout = layout.getVariant();
        const ctx = yield context(layout.context);
        ctx._variant = entity.toJSON();
        ctx[config.get('components.preview.yield')] = rendered;
        return engine.render(layout.viewContents, ctx, {
            path: entity.viewPath
        });
    }
    return rendered;
});
