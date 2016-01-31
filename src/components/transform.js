'use strict';

const co         = require('co');
const _          = require('lodash');
const Component  = require('./component');
const Collection = require('./collection');
const match      = require('../matchers');
const app        = require('../app');
const source     = require('../source');
const fs         = require('../fs');
const data       = require('../data');
const config     = require('../config');
const logger     = require('../logger');

const ext        = config.get('components.view.ext');

module.exports = function (fileTree, parent) {
    const splitter = config.get('components.splitter');
    const build = co.wrap(function* (dir, parent) {

        const children = dir.children || [];
        const props = {
            name: dir.name
        };
        if (parent) {
            props.isHidden = dir.isHidden;
            props.order    = dir.order;
        }

        const dirConfig = yield data.getConfig(match.findConfigFor(dir.name, children), props);
        if (parent) {
            dirConfig.parent = parent;
        }
        const collection = yield Collection.create(dirConfig);

        // first figure out if it's a component directory or not...

        if (parent) {
            const componentView = _.find(children, { name: dir.name, ext: ext });
            if (componentView) { // it is a component
                const conf = yield data.getConfig(match.findConfigFor(componentView.name, children), {
                    _name:    dir.name,
                    order:    dir.order,
                    isHidden: dir.isHidden,
                    view:     componentView.base,
                    viewPath: componentView.path,
                    dir:      dir.path,
                });
                conf.parent = collection;
                return Component.create(conf, children);
            }
        }

        // not a component, so go through the items and group into components and collections

        const directories    = children.filter(item => item.isDirectory);
        const collections    = yield directories.map(item => build(item, collection));
        const componentViews = children.filter(match.components);
        const variants       = children.filter(match.variants);

        const components = yield componentViews.map(item => {
            const related = variants.filter(sibling => sibling.name.startsWith(item.name));
            const conf    = data.getConfig(match.findConfigFor(item.name, children), {
                _name:    item.name,
                order:    item.order,
                isHidden: item.isHidden,
                view:     item.base,
                viewPath: item.path,
                dir:      dir.path,
            });
            return conf.then(c => {
                c.parent = collection;
                related.push(item);
                return Component.create(c, related);
            });
        });

        collection.items = _.orderBy(_.concat(components, collections), ['type', 'order', 'name'], ['desc', 'asc', 'asc']);
        return collection;
    });
    return build(fileTree);
};
