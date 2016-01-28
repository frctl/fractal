'use strict';

const co         = require('co');
const _          = require('lodash');
const Page       = require('./page');
const match      = require('../matchers');
const source     = require('../source');
const fs         = require('../fs');
const config     = require('../config');
const logger     = require('../logger');
const Collection = require('../collection');

const self = module.exports = {

    load(dirPath) {
        dirPath = dirPath || config.get('pages.path');
        return this.fetch(dirPath, () => {
            return fs.describe(dirPath).then(t => this._transform(t));
        });
    },

    refresh(event, path, rootDir) {
        // TODO: be smarter about re-caclulation of component tree
        this.clear(rootDir);
    },

    _transform(fileTree) {
        const build = co.wrap(function* (dir, root) {
            const props = {
                name: dir.name
            };
            if (!root) {
                props.isHidden = dir.isHidden;
                props.order = dir.order;
            }
            const dirConfig = yield self.loadConfigFile(dir.name, dir.children, props);
            const items = yield dir.children.map(item => {
                if (match.pages(item)) {
                    const props = {
                        name:     item.name,
                        isHidden: item.isHidden,
                        order:    item.order,
                        lang:     item.lang,
                        buffer:   item.buffer
                    };
                    return self.loadConfigFile(item.name, dir.children, props).then(c => Page.create(c));
                } else if (item.isDirectory) {
                    return build(item);
                }
                return Promise.resolve(null);
            });
            return Collection.create(dirConfig, _.compact(items));
        });
        return build(fileTree, true);
    }
};

Object.assign(self, source);
