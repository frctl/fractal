'use strict';

const co         = require('co');
const _          = require('lodash');
const Page       = require('./page');
const match      = require('../matchers');
const source     = require('../source');
const fs         = require('../fs');
const data       = require('../data');
const config     = require('../config');
const logger     = require('../logger');
const Collection = require('../collection');

module.exports = function(fileTree) {
        const build = co.wrap(function* (dir, root) {
        const props = {
            name: dir.name
        };
        if (!root) {
            props.isHidden = dir.isHidden;
            props.order = dir.order;
        }
        const dirConfig = yield data.getConfig(match.findConfigFor(dir.name, dir.children), props);
        const items = yield dir.children.map(item => {
            if (match.pages(item)) {
                const props = {
                    name:     item.name,
                    isHidden: item.isHidden,
                    order:    item.order,
                    lang:     item.lang,
                    buffer:   item.buffer
                };
                return data.getConfig(match.findConfigFor(item.name, dir.children), props).then(c => Page.create(c));
            } else if (item.isDirectory) {
                return build(item);
            }
            return Promise.resolve(null);
        });
        return Collection.create(dirConfig, _.compact(items));
    });
    return build(fileTree, true);

};
