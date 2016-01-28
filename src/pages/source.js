'use strict';

const co         = require('co');
const _          = require('lodash');
const anymatch   = require('anymatch');
const Page       = require('./page');
const source     = require('../source');
const fs         = require('../fs');
const config     = require('../config');
const logger     = require('../logger');
const utils      = require('../utils');
const Collection = require('../collection');

const pageExt    = config.get('pages.ext').toLowerCase();
const isPage     = anymatch(`**/*${pageExt}`);

const self = module.exports = {

    load(dirPath) {
        dirPath = dirPath || config.get('pages.path');
        return this.fetch(dirPath, () => {
            return fs.describe(dirPath).then(t => this._transform(t))
        });
    },

    refresh(event, path, rootDir) {
        // TODO: be smarter about re-caclulation of component tree
        this.clear(rootDir);
    },

    _transform(fileTree) {
        const build = co.wrap(function* (dir, root){
            const props = {
                name: dir.name
            };
            if (!root) {
                props.isHidden = dir.isHidden;
                props.order = dir.order;
            }
            const dirConfig = yield self.loadConfigFile(dir.name, dir.children, props);
            const items = yield dir.children.map(item => {
                if (item.isFile && isPage(item.path)) {
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
