'use strict';

const _                 = require('lodash');
const Entity            = require('../../core/entities/entity');

module.exports = class Variant extends Entity {

    constructor(config, view, assets, parent){
        super(config.name, config, parent);
        this.isVariant = true;
        this.view        = config.view;
        this.viewPath    = config.viewPath;
        this.notes       = config.notes || this.parent.notes;
        this.isDefault   = config.isDefault || false;
        this.lang        = view.lang.name;
        this.editorMode  = view.lang.mode;
        this.editorScope = view.lang.scope;
        this._view       = view;
        this._assets     = assets;
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

    render(context, preview) {
        return this.source.render(this, context, {
            preview: preview
        });
    }

    variant() {
        return this;
    }

    defaultVariant() {
        return this;
    }

    assets() {
        return this._assets;
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
        self.content   = this.getContentSync();
        self.assets    = this.assets().toJSON();
        return self;
    }

}
