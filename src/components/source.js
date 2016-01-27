'use strict';

const co             = require('co');
const _              = require('lodash');
const Component      = require('./component');
const view           = require('./view');
const app            = require('../app');
const source         = require('../source');
const fs             = require('../fs');
const config         = require('../config');
const logger         = require('../logger');
const utils          = require('../utils');
const Collection     = require('../collection');

const isComponentExt = (ext) => (ext === view.engine.ext);

const self = module.exports = {

    load(dirPath) {
        dirPath = dirPath || config.get('components.path');
        return this.fetch(dirPath, () => {
            return fs.describe(dirPath).then(t => this._transform(t))
        });
        // if (!treeCache.has(dirPath)) {
        //     const components = fs.describe(dirPath || config.get('components.path'))
        //                          .then(fileTree => this._transform(fileTree));
        //     treeCache.set(dirPath, components);
        // }
        // if (!watchers.has(dirPath)) {
        //     // watchers.set(dirPath, this.createMonitor(dirPath, (event, path) = {
        //     //         // TODO: make page tree rebuilding more refined rather than all or nothing.
        //     //         pages = null;
        //     //         app.emit("page-tree-changed");
        //     //     }));
        // }
        // return treeCache.get(dirPath);
    },

    _transform(fileTree) {
        const splitter = config.get('components.splitter');
        const build = co.wrap(function* (dir, root){
            const children = dir.children;

            // first figure out if it's a component directory or not...
            if (!root) {
                const componentView = _.find(children, {'name': dir.name, 'ext': view.engine.ext});
                if (componentView) {
                    // it is a component
                    const conf = yield self.loadConfigFile(componentView.name, children, {
                        name:     dir.name,
                        order:    dir.order,
                        isHidden: dir.isHidden,
                    });
                    return Component.create(conf, children);
                }
            }

            // not a component, so go through the items and group into components and/or collections
            const directories    = children.filter(item => item.isDirectory);
            const collections    = yield directories.map(item => build(item));

            const views          = children.filter(item => item.isFile && item.ext === view.engine.ext);
            const componentViews = views.filter(item => ! item.name.includes(splitter));
            const variants       = _.differenceBy(views, componentViews, 'base');

            const components = yield componentViews.map(item => {
                const related = variants.filter(sibling => sibling.name.startsWith(item.name));
                const conf  = self.loadConfigFile(item.name, children, {
                    name:     item.name,
                    order:    item.order,
                    isHidden: item.isHidden,
                });
                return conf.then(c => Component.create(c, related));
            });

            const props = {
                name: dir.name
            };
            if (!root) {
                props.isHidden = dir.isHidden;
                props.order    = dir.order;
            }
            const dirConfig = yield self.loadConfigFile(dir.name, children, props);
            const items = _.orderBy(_.concat(components, collections), ['type','order','name'], ['desc','asc','asc']);
            return Collection.create(dirConfig, items);
        });
        return build(fileTree, true);
    }
};

Object.assign(self, source);
