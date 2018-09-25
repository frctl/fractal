'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const Path = require('path');
const mix = require('./mixins/mix');
const Emitter = require('./mixins/emitter');

module.exports = class Adapter extends mix(Emitter) {

    constructor(engine, source) {
        super();
        this._engine = engine;
        this._source = source;
        this._views = [];
        this._hasLoaded = false;
        this._handlePrefix = '@';
        source.on('loaded', () => this._onSourceChange());
        source.on('updated', eventData => this._onSourceChange(eventData));
    }

    get engine() {
        return this._engine;
    }

    get views() {
        return this._views;
    }

    setHandlePrefix(prefix) {
        this._handlePrefix = prefix;
        return this;
    }

    load() {
        if (!this._hasLoaded) {
            this._loadViews();
        }
    }

    getReferencesForView(handle) {
        const view = this.getView(handle);
        return view ? this._parseReferences(view) : [];
    }

    getView(handle) {
        let prefixMatcher = new RegExp(`^\\${this._handlePrefix}`);
        return _.find(this._views, view => (view.handle.replace(prefixMatcher, '') === handle.replace(prefixMatcher, '')));
    }

    _parseReferences(view) {
        const matcher = new RegExp(`\\${this._handlePrefix}[0-9a-zA-Z\-\_]*`, 'g');
        const content = view.content;
        const referenced = content.match(matcher) || [];
        return _.uniq(_.compact(referenced.map(handle => this._source.find(handle))));
    }

    _loadViews() {
        const views = [];
        for (const item of this._source.flattenDeep()) {
            const view = {
                handle: `${this._handlePrefix}${item.handle}`,
                path: item.viewPath,
                content: item.content,
            };
            views.push(view);
            this.emit('view:added', view);
            if (item.alias) {
                const view = {
                    handle: `${this._handlePrefix}${item.alias}`,
                    path: item.viewPath,
                    content: item.content,
                };
                views.push(view);
                this.emit('view:added', view);
            }
        }
        this._views = views;
        this._hasLoaded = true;
        return views;
    }

    _updateView(view) {
        const entity = this._source.find(view.handle);
        if (entity) {
            view.content = entity.content;
            this.emit('view:updated', view);
        }
    }

    _onSourceChange(eventData) {
        if (eventData && eventData.isTemplate) {
            if (eventData.isWrapper) {
                if (eventData.event === 'change') {
                    this.emit('wrapper:updated', eventData.path);
                } else if (eventData.event === 'unlink') {
                    this.emit('wrapper:removed', eventData.path);
                }
                return this._views;
            }
            const touched = _.filter(this._views, ['path', Path.resolve(eventData.path)]);
            if (eventData.event === 'change') {
                touched.forEach(view => this._updateView(view));
                return this._views;
            } else if (eventData.event === 'unlink') {
                const touchedPaths = _.map(touched, view => view.path);
                this._views = _.reject(this._views, v => _.includes(touchedPaths, v.path));
                touched.forEach(view => this.emit('view:removed', view));
                return this._views;
            }
        }
        return this._loadViews();
    }

    _resolve(result) {
        return Promise.resolve(result);
    }

    render(path, str, context, meta) {
        throw new Error('Template engine adapter classes must provide a \'render\' method.');
    }


};
