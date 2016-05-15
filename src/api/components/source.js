'use strict';

const _                   = require('lodash');
const co                  = require('co');
const anymatch            = require('anymatch');
const Component           = require('./component');
const ComponentCollection = require('./collection');
const Asset               = require('../assets/asset');
const AssetCollection     = require('../assets/collection');
const Data                = require('../../core/data');
const EntitySource        = require('../../core/entities/source');

module.exports = class ComponentSource extends EntitySource {

    constructor(app){
        super('components', app);
    }

    get source(){
        return this;
    }

    fileType(file) {
        if (this.isAsset(file)) {
            return 'asset';
        }
        if (this.isConfig(file)) {
            return 'config';
        }
        if (this.isView(file) || this.isVarView(file)) {
            return 'view';
        }
        if (this.isReadme(file)) {
            return 'readme';
        }
    }

    isView(file) {
        return anymatch([`**/*${this.get('ext')}`, `!**/*${this.get('splitter')}*${this.get('ext')}`, `!**/*.config.${this.get('ext')}`], this._getPath(file));
    }

    isVarView(file) {
        return anymatch(`**/*${this.get('splitter')}*${this.get('ext')}`, this._getPath(file));
    }

    isReadme(file) {
        return anymatch(`**/readme.md`, this._getPath(file));
    }

    isAsset(file) {
        return anymatch(['**/*.*', `!**/*${this.get('ext')}`, `!**/*.config.{js,json,yaml,yml}`, `!**/readme.md`], this._getPath(file));
    }

    _parse (fileTree) {

        const source = this;

        const build = co.wrap(function* (dir, parent) {

            let collection;
            const children    = dir.children || [];
            const files       = children.filter(item => item.isFile);
            const directories = children.filter(item => item.isDirectory);

            const matched     = {
                directories: directories,
                files:       files,
                views:       files.filter(f => source.isView(f)),
                varViews:    files.filter(f => source.isVarView(f)),
                configs:     files.filter(f => source.isConfig(f)),
                readmes:     files.filter(f => source.isReadme(f)),
                assets:      files.filter(f => source.isAsset(f)),
            };

            const dirConfig = yield EntitySource.getConfig(_.find(matched.configs, f => f.name.startsWith(dir.name)), {
                name:     dir.name,
                isHidden: dir.isHidden,
                order:    dir.order,
                dir:      dir.path,
                collated: dir.collated
            });

            // first figure out if it's a component directory or not...

            const view = _.find(matched.views, { name: dir.name });
            if (view) { // it is a component
                const nameMatch    = `${dir.name}`;
                dirConfig.view     = view.base;
                dirConfig.viewName = dir.name;
                dirConfig.viewPath = view.path;
                const assets       = new AssetCollection({}, matched.assets.map(f => new Asset(f)));
                const files        = {
                    view:     view,
                    readme:   matched.readmes[0],
                    varViews: _.filter(matched.varViews, f => f.name.startsWith(nameMatch))
                };
                return Component.create(dirConfig, files, assets, parent);
            }

            // not a component, so go through the items and group into components and collections

            if (parent.isSource) {
                collection = source;
                source.setProps(dirConfig);
            } else {
                collection = new ComponentCollection(dirConfig, [], parent);
            }

            const collections = yield matched.directories.map(item => build(item, collection));
            const components  = yield matched.views.map(view => {
                const nameMatch = `${view.name}`;
                const configFile = _.find(matched.configs, f => f.name.startsWith(nameMatch));
                const conf    = EntitySource.getConfig(configFile, {
                    name:     view.name,
                    order:    view.order,
                    isHidden: view.isHidden,
                    view:     view.base,
                    viewName: view.name,
                    viewPath: view.path,
                    dir:      dir.path,
                });

                return conf.then(c => {
                    const files = {
                        view: view,
                        readme: null,
                        varViews: matched.varViews.filter(f => f.name.startsWith(nameMatch)),
                    };
                    const assets = new AssetCollection({}, []);
                    return Component.create(c, files, assets, parent);
                });
            });

            const items = yield (_.concat(components, collections));
            collection.setItems(_.orderBy(items, ['order', 'name']));
            return collection;
        });

        return build(fileTree, this);
    }

}
