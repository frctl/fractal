'use strict';

const _                   = require('lodash');
const co                  = require('co');
const anymatch            = require('anymatch');
const Component           = require('./component');
const ComponentCollection = require('./collection');
const Asset               = require('../assets/asset');
const AssetCollection     = require('../assets/collection');
const Data                = require('../../core/data');
const Log                 = require('../../core/log');
const resolver            = require('../../core/resolver');
const EntitySource        = require('../../core/entities/source');

module.exports = class ComponentSource extends EntitySource {

    constructor(app){
        super('components', app);
    }

    get source(){
        return this;
    }

    assets() {
        let assets = [];
        for (let comp of this.flatten()) {
            assets = assets.concat(comp.assets().toArray());
        }
        return new AssetCollection({}, assets);
    }

    components() {
        return super.entities();
    }

    variants() {
        let items = [];
        for (let component of this.components()) {
            items = _.concat(items, component.variants().toArray());
        }
        return this.newSelf(items);
    }

    find() {
        if (this.size === 0 || arguments.length === 0) {
            return;
        }
        const args = Array.from(arguments);
        if (args.length == 1 && _.isString(args[0]) && !args[0].startsWith('@') && args[0].indexOf('.') !== -1) {
            return this.findFile(args[0]);
        }
        const isHandleFind = args.length == 1 && _.isString(args[0]) && args[0].startsWith('@');
        for (let item of this) {
            if (item.isCollection) {
                const search = item.find.apply(item, args);
                if (search) return search;
            } else if (item.isComponent) {
                const matcher = isHandleFind ? this._makePredicate.apply(null, ['handle', args[0].replace('@', '')]) : this._makePredicate.apply(null, args);
                if (matcher(item)) return item;
            }
        }
        if (isHandleFind) {
            for (let item of this.entities()) {
                let variant = item.variants().find(args[0]);
                if (variant) return variant;
            }
        }
    }

    resolve(context) {
        return resolver.context(context, this);
    }

    renderString(str, context) {
        return this.engine().render(null, str, context);
    }

    renderPreview(entity, preview) {
        preview = preview !== false ? preview : false;
        let context;
        if (entity.isComponent) {
            context = entity.variants().default().context;
        } else {
            context = entity.context;
        }
        return this.render(entity, context, { preview: preview });
    }

    /**
     * Main render method. Accepts a component or variant
     * and renders them appropriately.
     *
     * Rendering a component results in the rendering of the components' default variant,
     * unless the collated option is 'true' - in this case it will return a collated rendering
     * of all it's variants.
     *
     * @param {Component/Variant} entity
     * @param {Object} context
     * @param {Object} opts
     * @return {Promise}
     * @api public
     */

    render(entity, context, opts) {

        opts           = opts || {};
        opts.preview   = opts.preview || opts.useLayout || false;
        opts.collate   = opts.collate  || false;

        const self = this;

        if (!entity) {
            return Promise.reject(null);
        }
        if (_.isString(entity)) {
            let str = entity;
            if (entity.indexOf('@') === 0) {
                entity = this.find(entity);
                if (!entity) {
                    throw new Error(`Cannot find component ${str}`);
                }
            } else {
                return fs.readFileAsync(entity, 'utf8').then(content => {
                    return this.engine().render(entity, content, context);
                });
            }
        }

        return co(function* () {
            const source = yield self.load();
            let rendered;
            if (entity.isComponent || entity.isVariant) {
                if (entity.isComponent) {
                    if (entity.isCollated && opts.collate) {
                        rendered = yield self._renderCollatedComponent(entity, context);
                    } else {
                        entity = entity.variants().default();
                        rendered = yield self._renderVariant(entity, context);
                    }
                } else {
                    rendered = yield self._renderVariant(entity, context);
                }
                if (opts.preview && entity.preview) {
                    let target = entity.toJSON();
                    target.component = variant.parent.toJSON();
                    let layout = _.isString(opts.preview) ? opts.preview : entity.preview;
                    return yield self._wrapInLayout(rendered, layout, {
                        _target: target
                    });
                }
                return rendered;
            } else {
                throw new Error(`Only components or variants can be rendered.`);
            }
        });
    }

    *_renderVariant(variant, context) {
        context = context || variant.context;
        const content = yield variant.getContent();
        const ctx     = yield this.resolve(context);
        ctx._self     = variant.toJSON();
        ctx._self.component = variant.parent.toJSON();
        return this.engine().render(variant.viewPath, content, ctx);
    }

    *_renderCollatedComponent(component, context) {
        context = context || {};
        return (yield component.variants().filter('isHidden', false).toArray().map(variant => {
            let ctx = context[`@${variant.handle}`] || variant.context;
            ctx._self = variant.toJSON();
            ctx._self.component = variant.parent.toJSON();
            return this.render(variant, ctx).then(markup => {
                const collator = component.collator;
                return _.isFunction(collator) ? collator(markup, variant) : markup;
            });
        })).join('\n');
    }

    *_wrapInLayout(content, identifier, context) {
        let layout = this.find(identifier);
        let layoutContext, layoutContent, viewpath;
        if (!layout) {
            Log.error(`Preview layout ${identifier} not found.`);
            return content;
        }
        if (layout.isFile) {
            layoutContext = {};
            layoutContent = yield layout.read();
            viewpath = layout.path;
        } else {
            if (layout.isComponent) {
                layout = layout.variants().default();
            }
            layoutContext = yield this.resolve(layout.context);
            layoutContent = yield layout.getContent();
            viewpath = layout.viewPath;
        }
        layoutContext = _.defaults(layoutContext, context || {});
        layoutContext[this.get('yield')] = content;
        const renderMethod = (_.isFunction(this.engine().renderLayout)) ? 'renderLayout' : 'render';
        return this.engine()[renderMethod](viewpath, layoutContent, layoutContext);
    }

    statusInfo(handle) {
        const statuses = this.get('statuses');
        const defaultStatus = this.get('default.status')
        if (_.isNull(handle)) {
            return null;
        }
        if (_.isUndefined(handle)) {
            return statuses[defaultStatus];
        }
        if (!statuses[handle]) {
            Log.error(`Status ${handle} is not a known option.`);
            return statuses[defaultStatus];
        }
        return statuses[handle];
    }

    fileType(file) {
        let type = super.fileType(file);
        if (type) {
            return type;
        }
        if (this.isAsset(file)) {
            return 'asset';
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
                return Component.create(dirConfig, files, assets, parent || source);
            }

            // not a component, so go through the items and group into components and collections

            if (!parent) {
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
                    return Component.create(c, files, assets, parent || source);
                });
            });

            const items = yield (_.concat(components, collections));
            collection.setItems(_.orderBy(items, ['order', 'name']));
            return collection;
        });

        return build(fileTree);
    }

}
