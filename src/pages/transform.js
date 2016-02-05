'use strict';

const co         = require('co');
const _          = require('lodash');
const Page       = require('./page');
const Collection = require('./collection');
const match      = require('../matchers');
const source     = require('../source');
const fs         = require('../fs');
const data       = require('../data');
const config     = require('../config');
const logger     = require('../logger');

module.exports = function (fileTree) {
    const build = co.wrap(function* (dir, parent) {
        const props = {
            name: dir.name
        };
        if (root) {
            props.isHidden = dir.isHidden;
            props.order = dir.order;
        }
        const dirConfig = yield data.getConfig(match.findConfigFor(dir.name, dir.children), props);
        dirConfig.parent = parent;
        const collection = yield Collection.create(dirConfig);

        const items = yield dir.children.map(item => {
            if (match.pages(item)) {
                const props = {
                    name:     item.name,
                    isHidden: item.isHidden,
                    order:    item.order,
                    lang:     item.lang,
                    buffer:   item.buffer,
                    filePath: item.path
                };
                return data.getConfig(match.findConfigFor(item.name, dir.children), props).then(c => {
                    c.parent = collection;
                    return Page.create(c);
                });
            } else if (item.isDirectory) {
                return build(item, collection);
            }
            return Promise.resolve(null);
        });

        collection.items = _.orderBy(_.compact(items), ['order', 'name']);
        return collection;
    });
    return build(fileTree);
};
