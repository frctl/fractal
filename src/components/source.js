'use strict';

const Promise         = require('bluebird');
const _               = require('lodash');
const co              = require('co');
const fs              = Promise.promisifyAll(require('fs'));
const anymatch        = require('anymatch');
const beautifyHTML    = require('js-beautify').html;
const transform       = require('./transform');
const console         = require('../console');
const Source          = require('../source');
const resolve         = require('../context');
const AssetCollection = require('../assets/collection');

module.exports = class ComponentSource extends Source {

    constructor(items, app) {
        super('components', items, app);
        this.transform = transform;
    }

    assets() {
        let assets = [];
        for (let comp of this.flatten()) {
            assets = assets.concat(comp.assets().toArray());
        }
        return new AssetCollection({}, assets);
    }

    resolve(context) {
        return resolve(context, this);
    }

    renderString(str, context) {
        return this.engine().render(null, str, context);
    }

    renderPreview(entity, useLayout) {
        useLayout = useLayout !== false ? true : false;
        let context;
        if (entity.type == 'component') {
            context = entity.variants().default().context;
        } else {
            context = entity.context;
        }
        return this.render(entity, context, { useLayout: useLayout });
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
        opts.useLayout = opts.useLayout || false;
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
            if (_.includes(['component', 'variant'], entity.type)) {
                if (entity.type == 'component') {
                    if (entity.isCollated && opts.collate) {
                        rendered = yield self._renderCollatedComponent(entity, context);
                    } else {
                        entity = entity.variants().default();
                        rendered = yield self._renderVariant(entity, context);
                    }
                } else {
                    rendered = yield self._renderVariant(entity, context);
                }
                if (opts.useLayout && entity.preview) {
                    return yield self._wrapInLayout(rendered, entity.preview, {
                        _target: entity.toJSON()
                    });
                }
                return beautifyHTML(rendered, {
                    // TODO: move to config
                    indent_size: 4,
                    preserve_newlines: true,
                    max_preserve_newlines: 1
                });
            } else {
                throw new Error(`Cannot render entity of type ${entity.type}`);
            }
        }).catch(err => {
            console.error(err);
        });
    }

    *_renderVariant(variant, context) {
        context = context || variant.context;
        const content = yield variant.getContent();
        const ctx     = yield this.resolve(context);
        ctx._self     = variant.toJSON();
        return this.engine().render(variant.viewPath, content, ctx);
    }

    *_renderCollatedComponent(component, context) {
        context = context || {};
        return (yield component.variants().filter('isHidden', false).toArray().map(variant => {
            return this.resolve(context[`@${variant.handle}`] || variant.context).then(ctx => {
                ctx._self = variant.toJSON();
                return this.render(variant, ctx).then(markup => {
                    const collator = component.collator;
                    return _.isFunction(collator) ? collator(markup, variant) : markup;
                });
            });
        })).join('\n');
    }

    *_wrapInLayout(content, identifier, context) {
        let layout = this.find(identifier);
        let layoutContext, layoutContent, viewpath;
        if (!layout) {
            console.error(`Preview layout ${identifier} not found.`);
            return content;
        }
        if (layout.type == 'file') {
            layoutContext = {};
            layoutContent = yield layout.read();
            viewpath = layout.path;
        } else {
            if (layout.type === 'component') {
                layout = layout.variants().default();
            }
            layoutContext = yield this.resolve(layout.context);
            layoutContent = yield layout.getContent();
            viewpath = layout.viewPath;
        }
        layoutContext = _.defaults(layoutContext, context || {});
        layoutContext[this.setting('yield')] = content;
        const renderMethod = (typeof this.engine().renderLayout === 'function') ? 'renderLayout' : 'render';
        return this.engine()[renderMethod](viewpath, layoutContent, layoutContext);
    }

    statusInfo(handle) {
        const statuses = this.setting('statuses');
        const defaultStatus = this.setting('default.status')
        if (_.isNull(handle)) {
            return null;
        }
        if (_.isUndefined(handle)) {
            return statuses[defaultStatus];
        }
        if (!statuses[handle]) {
            console.error(`Status ${handle} is not a known option.`);
            return statuses[defaultStatus];
        }
        return statuses[handle];
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
            if (item.type === 'collection') {
                const search = item.find.apply(item, args);
                if (search) return search;
            } else if (item.type === 'component') {
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
        return anymatch([`**/*${this.setting('ext')}`, `!**/*${this.setting('splitter')}*${this.setting('ext')}`, `!**/*.config.${this.setting('ext')}`], this._getPath(file));
    }

    isVarView(file) {
        return anymatch(`**/*${this.setting('splitter')}*${this.setting('ext')}`, this._getPath(file));
    }
    
    isReadme(file) {
        return anymatch(`**/readme.md`, this._getPath(file));
    }

    isAsset(file) {
        return anymatch(['**/*.*', `!**/*${this.setting('ext')}`, `!**/*.config.{js,json,yaml,yml}`, `!**/readme.md`], this._getPath(file));
    }

};
