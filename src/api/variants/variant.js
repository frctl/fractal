'use strict';

const Path   = require('path');
const _      = require('lodash');
const utils  = require('../../core/utils');
const Entity = require('../../core/entities/entity');

module.exports = class Variant extends Entity {

    constructor(config, view, resources, parent){
        super(config.name, config, parent);
        this.isVariant     = true;
        this.view          = config.view;
        this.viewPath      = config.viewPath;
        this.viewDir       = config.dir;
        this.relViewPath   = Path.relative(this.source.fullPath, Path.resolve(this.viewPath));
        this.notes         = config.notes || this.parent.notes;
        this.isDefault     = config.isDefault || false;
        this.lang          = view.lang.name;
        this.editorMode    = view.lang.mode;
        this.editorScope   = view.lang.scope;
        this._view         = view;
        this._resources    = resources;
        this._referencedBy = null;
        this._references   = null;
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

    get references() {
        if (!this._references) {
            let matcher = /\@[0-9a-zA-Z\-\_]*/g;
            let content = this.content;
            let referenced = content.match(matcher) || [];
            this._references = _.uniq(_.compact(referenced.map(handle => this.source.find(handle))));
        }
        return this._references;
    }

    get referencedBy() {
        if (!this._referencedBy) {
            this._referencedBy = this.source.getReferencesOf(this);
        }
        return this._referencedBy;
    }

    render(context, preview) {
        return this.source.render(this, context, {
            preview: preview
        });
    }

    renderWithGlobals(context, globals, preview) {
        return this.source.render(this, context, {
            preview: preview,
            globals: globals
        });
    }

    getPreviewContext(){
        return this.getResolvedContext();
    }

    getPreviewContent(){
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
        for (let item of this.resources()) {
            items[item.name] = item.toJSON().items;
        };
        return items;
    }

    getContent() {
        return this._view.read().then(c => c.toString());
    }

    getContentSync() {
        return this._view.readSync().toString();
    }

    toJSON(){
        const self = super.toJSON();
        self.isVariant = true;
        self.alias     = this.alias;
        self.notes     = this.notes;
        self.status    = this.status;
        self.display   = this.display;
        self.isDefault = this.isDefault;
        self.viewPath  = this.viewPath;
        self.preview   = this.preview;
        self.context   = this.context;
        self.resources = this.resourcesJSON();
        self.content   = this.getContentSync();
        return self;
    }

}
