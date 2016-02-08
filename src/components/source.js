'use strict';

const _         = require('lodash');
const co        = require('co');
const transform = require('./transform');
const logger    = require('../logger');
const Source    = require('../source');
const fs        = require('../fs');
const resolve   = require('../context');

module.exports = class ComponentSource extends Source {

    constructor(sourcePath, props, items) {
        super(sourcePath, props, items);
        this.status   = props.status;
        this.preview  = props.preview;
        this.display  = props.display;
        this.yield    = props.yield;
        this.splitter = props.splitter;
        this._statuses = props.status;
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
            const source   = yield (self.loaded ? Promise.resolve(self) : self.load());
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
        if (_.isUndefined(handle)) {
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

    _load() {
        return fs.describe(this.sourcePath).then(fileTree => {
            return transform(fileTree, this).then(self => {
                this.loaded = true;
                return self;
            });
        });
    }
}
