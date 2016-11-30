'use strict';

const _ = require('lodash');
const Path = require('path');
const utils = require('../../core/utils');
const Data = require('../../core/data');
const Entity = require('../../core/entities/entity');
const VariantCollection = require('../variants/collection');
const FileCollection = require('../files/collection');
const AssetCollection = require('../assets/collection');
const Asset = require('../assets/asset');

module.exports = class Component extends Entity {

    constructor(config, files, resources, parent) {
        super(config.name, config, parent);
        this.isComponent = true;
        this.defaultName = config.default ? utils.slugify(config.default.toLowerCase()) : 'default';
        this.notes = config.notes || null;
        this.notesFromFile = config.notesFromFile || false;
        this.lang = files.view.lang.name;
        this.editorMode = files.view.lang.mode;
        this.editorScope = files.view.lang.scope;
        this.viewPath = files.view.path;
        this.viewDir = files.view.dir;
        this.configData = config.raw;
        this.relViewPath = Path.relative(this.source.fullPath, Path.resolve(files.view.path));
        this._resources = resources;
        this._resourceCollections = null;
        this._variants = new VariantCollection({ name: `${this.name}-variants` }, [], parent);
        this._referencedBy = null;
        this._references = null;
    }

    _handle(config) {
        if (config.handle) {
            return utils.slugify(config.handle).toLowerCase();
        }
        return utils.slugify(this.parent.getProp('prefix') ? `${this.parent.getProp('prefix')}-${config.name}` : config.name).toLowerCase();
    }

    get isCollated() {
        return this.collated;
    }

    get content() {
        return this.variants().default().getContentSync();
    }

    get references() {
        if (!this._references) {
            this._references = this.variants().default().references;
        }
        return this._references;
    }

    get referencedBy() {
        if (!this._referencedBy) {
            this._referencedBy = this.variants().referencedBy;
        }
        return this._referencedBy;
    }

    get baseHandle() {
        return this.handle;
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

    getPreviewContext() {
        return this.isCollated ? this.variants().getCollatedContext() : this.variants().default().getResolvedContext();
    }

    getPreviewContent() {
        return this.isCollated ? this.variants().getCollatedContent() : this.variants().default().getContent();
    }

    setVariants(variantCollection) {
        this._variants = variantCollection;
    }

    hasTag(tag) {
        return _.includes(this.tags, tag);
    }

    resources() {
        if (!this._resourceCollections) {
            const collections = [];
            const groups = this.source.get('resources');
            if (groups) {
                for (const key in groups) {
                    const group = groups[key];
                    const items = this._resources.match(group.match).items().map(file => new Asset(file._file, this.source.relPath, this.source));
                    const files = new AssetCollection({
                        name: key,
                        label: group.label,
                        title: group.label,
                    }, items);
                    collections.push(files);
                }
            }
            this._resourceCollections = new AssetCollection({
                name: 'resources',
                label: 'Resources',
            }, collections);
        }
        return this._resourceCollections;
    }

    resourcesJSON() {
        const items = {};
        for (const item of this.resources()) {
            items[item.name] = item.toJSON().items;
        }
        return items;
    }

    flatten() {
        return this.variants();
    }

    component() {
        return this;
    }

    variants() {
        return this._variants;
    }

    toJSON() {
        const self = super.toJSON();
        self.isComponent = true;
        self.baseHandle = this.baseHandle;
        self.notes = this.notes;
        self.tags = this.tags;
        self.isCollated = this.isCollated;
        self.preview = this.preview;
        self.display = this.display;
        self.viewPath = this.viewPath;
        self.resources = this.resourcesJSON();
        self.variants = this.variants().toJSON();
        return self;
    }

    static *create(config, files, resources, parent) {
        config.notes = config.notes || config.readme;
        if (!config.notes && files.readme || config.notesFromFile && files.readme) {
            config.notesFromFile = true;
            config.notes = yield files.readme.read();
        }
        config.raw = files.config ? yield Data.readFile(files.config.path) : null;
        const comp = new Component(config, files, resources, parent);
        const variants = yield VariantCollection.create(comp, files.view, config.variants, files.varViews, config);
        comp.setVariants(variants);
        return comp;
    }

};
