'use strict';

const co         = require('co');
const _          = require('lodash');
const anymatch   = require('anymatch');
const Component  = require('./component');
const Collection = require('./collection');
const fs         = require('../fs');
const data       = require('../data');
const logger     = require('../logger');


module.exports = function (fileTree, config) {

    const isView    = anymatch([`**/*${config.ext}`, `!**/*${config.splitter}*${config.ext}`]);
    const isVarView = anymatch(`**/*${config.splitter}*${config.ext}`);
    const isConfig  = anymatch(`**/*.config.{js,json,yaml,yml}`);
    const isReadme  = anymatch(`**/readme.md`);

    const build = co.wrap(function* (dir, parent) {

        const children    = dir.children || [];
        const files    = children.filter(item => item.isFile);
        const directories = children.filter(item => item.isDirectory);
        const matched = {
            directories: directories,
            files:       files,
            views:       files.filter(f => isView(f.path)),
            varViews:    files.filter(f => isVarView(f.path)),
            configs:     files.filter(f => isConfig(f.path)),
            readmes:     files.filter(f => isReadme(f.path)),
        };

        const dirConfig   = _.find(matched.configs, f => f.name.startsWith(dir.name));

        // first figure out if it's a component directory or not...

        if (parent) {
            const view = _.find(matched.views, {name: dir.name});
            if (view) { // it is a component
                const nameMatch = `${dir.name}.`;
                const conf = yield data.getConfig(dirConfig, {
                    name:     dir.name,
                    order:    dir.order,
                    isHidden: dir.isHidden,
                    view:     view.base,
                    viewPath: view.path,
                    dir:      dir.path,
                });
                conf.parent = parent;
                return Component.create(conf, {
                    view:     view,
                    readme:   matched.readmes[0],
                    varViews: _.filter(matched.varViews, f => f.name.startsWith(nameMatch)),
                    other:    _.differenceBy([matched.files, matched.views, matched.varViews, matched.configs, matched.readmes, [view]], 'path')
                }, config);
            }
        }

        const props = {
            name: dir.name
        };
        if (parent) {
            props.isHidden = dir.isHidden;
            props.order    = dir.order;
        } else {
            props.status = config.defaults.status;
            props.layout = config.defaults.layout;
            props.display = config.defaults.display;
            props.context = config.defaults.context || {};
        }

        const dirConfigData = yield data.getConfig(dirConfig, props);
        if (parent) {
            dirConfigData.parent = parent;
        }
        const collection = yield Collection.create(dirConfigData, []);

        // not a component, so go through the items and group into components and collections
        
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
                }, config);
            });
        });

        collection.items = _.orderBy(_.concat(components, collections), ['type', 'order', 'name'], ['desc', 'asc', 'asc']);
        return collection;
    });
    return build(fileTree);
};
