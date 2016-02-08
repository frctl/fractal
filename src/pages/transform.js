'use strict';

const co         = require('co');
const _          = require('lodash');
const anymatch   = require('anymatch');
const Page       = require('./page');
const Collection = require('./collection');
const fs         = require('../fs');
const data       = require('../data');
const logger     = require('../logger');

module.exports = function (fileTree, source) {

    const isPage   = anymatch(`**/*${source.ext}`);
    const isConfig = anymatch(`**/*.config.{js,json,yaml,yml}`);

    const build = co.wrap(function* (dir, parent) {

        let collection;
        const children = dir.children || [];
        const configs = children.filter(f => isConfig(f.path));

        const dirConfig = yield data.getConfig(_.find(configs, f => f.name.startsWith(dir.name)), {
            name:     dir.name,
            isHidden: dir.isHidden,
            order:    dir.order,
            dir:      dir
        });
        dirConfig.parent = parent;

        if (!parent) {
            collection = source;
            source.context = dirConfig.context || {};
        } else {
            collection = new Collection(dirConfig);
            collection.source = source;
        }

        const items = yield children.map(item => {
            if (isPage(item.path)) {
                const nameMatch = `${item.name}.`;
                const configFile = _.find(configs, f => f.name.startsWith(nameMatch));
                return data.getConfig(configFile, {
                    name:     item.name,
                    isHidden: item.isHidden,
                    order:    item.order,
                    lang:     item.lang,
                    buffer:   item.buffer,
                    filePath: item.path
                }).then(c => {
                    c.parent = collection;
                    c.source = source;
                    return Page.create(c);
                });
            } else if (item.isDirectory) {
                return build(item, collection);
            }
            return Promise.resolve(null);
        });
        
        collection.setItems(_.orderBy(_.compact(items), ['order', 'name']));
        return collection;
    });

    return build(fileTree);
};
