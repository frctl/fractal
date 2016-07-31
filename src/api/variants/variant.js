'use strict';

const Path = require('path');
const _ = require('lodash');
const utils = require('../../core/utils');
const Entity = require('../../core/entities/entity');

module.exports = class Variant extends Entity {

    constructor(config, view, resources, parent) {
        super(config.name, config, parent);
        this.isVariant = true;
        this.view = config.view;
        this.viewPath = config.viewPath;
        this.viewDir = config.dir;
        this.relViewPath = Path.relative(this.source.fullPath, Path.resolve(this.viewPath));
        this.notes = config.notes || this.parent.notes;
        this.isDefault = config.isDefault || false;
        this.lang = view.lang.name;
        this.editorMode = view.lang.mode;
        this.editorScope = view.lang.scope;
        this._view = view;
        this._resources = resources;
        this._referencedBy = null;
        this._references = null;
    }

    _title(config) {
        return config.title || `${this.parent.title}: ${this.label}`;
    }

    _handle(config) {
        return utils.slugify(config.handle).toLowerCase();
    }

    get alias() {
        if (this.isDefault) {
            return this.parent.handle;
        }
        return null;
    }

    get siblings() {
        return this.parent.variants();
    }

    get content() {
        return this.getContentSync();
    }

    get baseHandle() {
        return this.parent.handle;
    }

    get references() {
        if (!this._references) {
            try {
                this._references = this.source._engine.getReferencesForView(this.handle);
            } catch (e) {
                // older Adapters will throw an error because getReferencesForView is not defined
                this._references = this._parseReferences();
            }
        }
        return this._references;
    }

    get referencedBy() {
        if (!this._referencedBy) {
            this._referencedBy = this.source.getReferencesOf(this);
        }
        return this._referencedBy;
    }

    render(context, env, opts) {
        return this.source.render(this, context, env, opts);
    }

    /*
     * Deprecated, do not use!
     */
    renderWithGlobals(context, globals, preview, collate) {
        return this.source.render(this, context, {
            request: globals._request || {},
            server: globals._env.server,
            builder: globals._env.builder,
        }, {
            preview: preview,
            collate: collate,
        });
    }

    /*
     * Deprecated, do not use!
     */
    _parseReferences() {
        const matcher = /\@[0-9a-zA-Z\-\_]*/g;
        const content = this.content;
        const referenced = content.match(matcher) || [];
        return _.uniq(_.compact(referenced.map(handle => this.source.find(this.handle))));
    }

    getPreviewContext() {
        return this.getResolvedContext();
    }

    getPreviewContent() {
        return this.getContent();
    }

    component() {
        return this.parent;
    }

    variant() {
        return this;
    }

    defaultVariant() {
        return this;
    }

    resources() {
        return this._resources;
    }

    resourcesJSON() {
        const items = {};
        for (const item of this.resources()) {
            items[item.name] = item.toJSON().items;
        }
        return items;
    }

    getContent() {
        return this._view.read().then(c => c.toString());
    }

    getContentSync() {
        return this._view.readSync().toString();
    }

    toJSON() {
        const self = super.toJSON();
        self.isVariant = true;
        self.baseHandle = this.baseHandle;
        self.alias = this.alias;
        self.notes = this.notes;
        self.status = this.status;
        self.display = this.display;
        self.isDefault = this.isDefault;
        self.viewPath = this.viewPath;
        self.preview = this.preview;
        self.context = this.context;
        self.resources = this.resourcesJSON();
        self.content = this.getContentSync();
        return self;
    }

};
