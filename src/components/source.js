'use strict';

const _         = require('lodash');
const co        = require('co');
const anymatch  = require('anymatch');
const transform = require('./transform');
const logger    = require('../logger');
const Source    = require('../source');
const resolve   = require('../context');

module.exports = class ComponentSource extends Source {

    constructor(sourcePath, props, items) {
        super(sourcePath, props, items);
        this._status   = props.status.default;
        this._preview  = props.preview;
        this._display  = props.display;
        this.yield    = props.yield;
        this.splitter = props.splitter;
        this._statuses = props.status;
        this.transform = transform;
    }

    resolve(context) {
        return resolve(context, this);
    }

    renderPreview(entity, layout) {
        layout = layout !== false ? true : false;
        const variant = entity.getVariant();
        return this.render(variant, variant.context, layout);
    }

    render(entity, context, layout) {
        const self = this;
        const engine  = self.getEngine();
        const variant = entity.getVariant();
        const renderContext = context || variant.context;
        return co(function* (){
            const source   = yield (self.isLoaded ? Promise.resolve(self) : self.load());
            const context  = yield self.resolve(renderContext);
            const rendered = yield engine.render(variant.viewPath, variant.content, context);
            if (layout && variant.preview) {
                let layout = source.find(variant.preview);
                if (!layout) {
                    logger.error(`Preview layout ${variant.preview} for component ${variant._parent.handle} not found.`);
                    return rendered;
                }
                layout = layout.getVariant();
                let layoutContext = yield source.resolve(layout.context);
                layoutContext._variant = variant.toJSON();
                layoutContext[self.yield] = rendered;
                return engine.render(layout.viewPath, layout.content, layoutContext);
            }
            return rendered;
        });
    }

    statusInfo(handle){
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
            logger.error(`Status ${handle} is not a known option.`);
            return this._statuses.options[this._statuses.default];
        }
        return this._statuses.options[handle];
    }

    find(handle) {
        if (!handle) {
            return null;
        }
        for (let item of this) {
            if (item.type === 'collection') {
                const search = item.find(handle);
                if (search) return search;
            } else if (item.type === 'component' && (item.handle === handle || `@${item.handle}` === handle)) {
                return item;
            } else if (item.type === 'component') {
                let variant = item.getVariantByHandle(handle);
                if (variant) return variant;
            }
        }
    }

    isView(file) {
        return anymatch([`**/*${this.ext}`, `!**/*${this.splitter}*${this.ext}`], file.path);
    }

    isVarView(file) {
        return anymatch(`**/*${this.splitter}*${this.ext}`, file.path);
    }

    isConfig(file) {
        return anymatch(`**/*.config.{js,json,yaml,yml}`, file.path);
    }

    isReadme(file) {
        return anymatch(`**/readme.md`, file.path);
    }

}
