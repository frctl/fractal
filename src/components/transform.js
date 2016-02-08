'use strict';

const co         = require('co');
const _          = require('lodash');
const anymatch   = require('anymatch');
const Component  = require('./component');
const Collection = require('./collection');
const Source     = require('./source');
const fs         = require('../fs');
const data       = require('../data');
const logger     = require('../logger');

module.exports = function (fileTree, source) {

    const isView    = anymatch([`**/*${source.ext}`, `!**/*${source.splitter}*${source.ext}`]);
    const isVarView = anymatch(`**/*${source.splitter}*${source.ext}`);
    const isConfig  = anymatch(`**/*.config.{js,json,yaml,yml}`);
    const isReadme  = anymatch(`**/readme.md`);


    const build = co.wrap(function* (dir, parent) {

        let collection;
        const children    = dir.children || [];
        const files       = children.filter(item => item.isFile);
        const directories = children.filter(item => item.isDirectory);
        const matched     = {
            directories: directories,
            files:       files,
            views:       files.filter(f => isView(f.path)),
            varViews:    files.filter(f => isVarView(f.path)),
            configs:     files.filter(f => isConfig(f.path)),
            readmes:     files.filter(f => isReadme(f.path)),
        };

        const dirConfig = yield data.getConfig(_.find(matched.configs, f => f.name.startsWith(dir.name)), {
            name:     dir.name,
            isHidden: dir.isHidden,
            order:    dir.order,
            dir:      dir.path
        });
        dirConfig.parent = parent;

        // first figure out if it's a component directory or not...

        const view = _.find(matched.views, {name: dir.name});
        if (view) { // it is a component
            const nameMatch = `${dir.name}.`;
            dirConfig.view = view.base;
            dirConfig.viewPath = view.path;

            return Component.create(dirConfig, {
                view:     view,
                readme:   matched.readmes[0],
                varViews: _.filter(matched.varViews, f => f.name.startsWith(nameMatch)),
                other:    _.differenceBy([matched.files, matched.views, matched.varViews, matched.configs, matched.readmes, [view]], 'path')
            }, source);
        }

        // not a component, so go through the items and group into components and collections

        if (!parent) {
            collection = source;
            source.context = dirConfig.context || {};
            source.status  = dirConfig.status || source.status;
            source.preview = dirConfig.preview || source.preview;
            source.display = dirConfig.display || source.display;
        } else {
            collection = new Collection(dirConfig, []);
        }

        const collections = yield matched.directories.map(item => build(item, collection));
        const components  = yield matched.views.map(view => {
            const nameMatch = `${view.name}.`;
            const configFile = _.find(matched.configs, f => f.name.startsWith(nameMatch));
            const conf    = data.getConfig(configFile, {
                name:     view.name,
                order:    view.order,
                isHidden: view.isHidden,
                view:     view.base,
                viewPath: view.path,
                dir:      dir.path,
            });
            return conf.then(c => {
                c.parent = collection;
                return Component.create(c, {
                    view: view,
                    readme: null,
                    varViews: matched.varViews.filter(f => f.name.startsWith(nameMatch)),
                    other: []
                }, source);
            });
        });

        collection.setItems(_.orderBy(_.concat(components, collections), ['type', 'order', 'name'], ['desc', 'asc', 'asc']));
        return collection;
    });

    return build(fileTree);
};
