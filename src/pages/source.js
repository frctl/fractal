'use strict';

const co         = require('co');
const all        = require('co-flow').all;
const _          = require('lodash');
const fs         = require('../fs');
const config     = require('../config');
const data       = require('../data');
const logger     = require('../logger');
const Page       = require('./page');
const Collection = require('../collection');

const isPageExt = (ext) => (ext === config.get('pages.ext').toLowerCase());

module.exports = {

    config: null,

    load(dirPath) {
        return fs.describe(dirPath || config.get('pages.path'))
                 .then(fileTree => this._transform(fileTree));
    },

    _transform(fileTree) {
        var self = this;
        const build = co.wrap(function* (dir){
            let items = yield dir.children.map(item => {
                if (item.isFile && isPageExt(item.ext)) {
                    return Page.create(item, dir);
                } else if (item.isDirectory) {
                    return build(item);
                }
                return Promise.resolve(null);
            });
            const props = {
                path: dir.path,
                hidden: dir.hidden
                // TODO
            };
            return Collection.create(props, _.compact(items));
        });
        return build(fileTree);
    }
};
