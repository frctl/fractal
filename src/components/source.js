'use strict';

const Promise         = require('bluebird');
const _               = require('lodash');
const co              = require('co');
const fs              = Promise.promisifyAll(require('fs'));
const anymatch        = require('anymatch');
const transform       = require('./transform');
const console             = require('../console');
const Source          = require('../source');
const resolve         = require('../context');
const AssetCollection = require('../assets/collection');

module.exports = class ComponentSource extends Source {

    constructor(sourcePath, props, items, app) {
        props.name = 'components';
        super(sourcePath, props, items);
        this._app      = app;
        this._status   = props.status.default;
        this._preview  = props.preview.layout;
        this._display  = props.preview.display;
        this._statuses = props.status;
        this._prefix   = props.prefix || null;
        this.yield     = props.preview.yield;
        this.collator  = props.preview.collator;
        this.splitter  = props.splitter;
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
        if (entity.type === 'component') {
            entity = entity.variants().default();
        }
        return this.render(entity, entity.context, { useLayout: true });
    }

    /**
     * Main render method. Accepts a collection, component or variant
     * and renders them appropriately.
     *
     * Rendering a component results in the rendering of the components' default variant,
     * unless the collated option is 'true' - in this case it will return a collated rendering
     * of all it's variants.
     * Rendering a collection results in a collated rendering of
     * all the descendent items.
     *
     * @param {Collection/Component/Variant} entity
     * @param {Object} context
     * @param {Object} opts
     * @return {Promise}
     * @api public
     */

    render(entity, context, opts) {

        opts           = opts || {};
        opts.useLayout = opts.useLayout || false;
        opts.collated  = opts.collated  || false;

        const self = this;

        if (!entity) {
            return Promise.reject(null);
        }
        if (_.isString(entity)) {
            return fs.readFileAsync(entity, 'utf8').then(content => {
                return this.engine().render(entity, content, context);
            });
        }

        return co(function* () {
            const source = yield self.load();
            if (_.includes(['component', 'variant' /*, 'collection' */], entity.type)) {
                if (entity.type == 'component') {
                    entity = entity.variants().default();
                }
                const rendered = yield self._renderVariant(entity, context);
                if (opts.useLayout && entity.preview) {
                    return yield self._wrapInLayout(rendered, entity.preview, {
                        _target: entity.toJSON()
                    });
                }
                return rendered;
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

    // *_renderComponent(component, context) {
    //     const variant = component.variants().default();
    //     return yield this._renderVariant(variant, context);
    // }

    // _renderCollatedComponent: function* (component, context){
    //     const items = component.variants();
    // }

    // _renderCollection: function* (collection, context)  {
    //     const items = collection.flattenDeep().items();
    //     return this._renderCollated(items);
    // }

    // _renderCollated: function* (items, context){
    //     context = context || {};
    //     return (yield items.map(item => {
    //         const ctx = context[item.handle] || item.
    //         return this.render(item).then(markup => {
    //             return _.isFunction(this.collator) ? this.collator(markup, item) : markup;
    //         });
    //     })).join('\n');
    // }

    *_wrapInLayout(content, previewHandle, context) {
        let layout = this.find(previewHandle);
        if (!layout) {
            console.error(`Preview layout ${previewHandle} not found.`);
            return content;
        }
        if (layout.type === 'component') {
            layout = layout.variants().default();
        }
        let layoutContext = yield this.resolve(layout.context);
        let layoutContent = yield layout.getContent();
        layoutContext = _.defaults(layoutContext, context || {});
        layoutContext[this.yield] = content;
        return this.engine().render(layout.viewPath, layoutContent, layoutContext);
    }

    statusInfo(handle) {
        if (_.isUndefined(handle) || (_.isArray(handle) && !handle.length)) {
            return null;
        }
        if (_.isArray(handle)) {
            const handles = _.uniq(handle);
            if (handles.length === 1) {
                return this.statusInfo(handles[0]);
            }
            const statuses = _.compact(handles.map(l => this.statusInfo(l)));
            const details = _.clone(this._statuses.mixed);
            details.statuses = statuses;
            return details;
        }
        if (handle == this._statuses.mixed.handle) {
            return this._statuses.mixed;
        }
        if (!this._statuses.options[handle]) {
            console.error(`Status ${handle} is not a known option.`);
            return this._statuses.options[this._statuses.default];
        }
        return this._statuses.options[handle];
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
        for (let item of this) {
            if (item.type === 'collection') {
                const search = item.find.apply(item, arguments);
                if (search) return search;
            } else if (item.type === 'component') {
                const matcher = this._makePredicate.apply(null, arguments);
                if (matcher(item)) return item;
                if (arguments.length == 1 && _.isString(arguments[0]) && arguments[0].startsWith('@')) {
                    let variant = item.variants().find(arguments[0]);
                    if (variant) return variant;
                }
            }
        }
    }

    isView(file) {
        return anymatch([`**/*${this.ext}`, `!**/*${this.splitter}*${this.ext}`], file.path.toLowerCase());
    }

    isVarView(file) {
        return anymatch(`**/*${this.splitter}*${this.ext}`, file.path.toLowerCase());
    }

    isConfig(file) {
        return anymatch(`**/*.config.{js,json,yaml,yml}`, file.path.toLowerCase());
    }

    isReadme(file) {
        return anymatch(`**/readme.md`, file.path.toLowerCase());
    }

    isAsset(file) {
        return anymatch(['**/*.*', `!**/*${this.ext}`, `!**/*.config.{js,json,yaml,yml}`, `!**/readme.md`], file.path.toLowerCase());
    }

};
