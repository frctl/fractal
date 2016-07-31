'use strict';

const Path = require('path');
const Promise = require('bluebird');
const matter = require('gray-matter');
const _ = require('lodash');
const utils = require('../../core/utils');
const Entity = require('../../core/entities/entity');

module.exports = class Doc extends Entity {

    constructor(config, content, parent) {
        super(config.name, config, parent);
        this.isDoc = true;
        this.lang = config.lang;
        this.filePath = config.filePath;
        this.viewPath = this.filePath;
        this.relViewPath = Path.relative(this.source.fullPath, Path.resolve(this.filePath));
        this.content = content;
        this.file = config.file;
    }

    get isIndex() {
        return this.name === 'index';
    }

    _label(config) {
        return config.label || (this.isIndex ? this.source.get('indexLabel') : utils.titlize(config.name));
    }

    _handle(config) {
        if (config.handle) {
            return utils.slugify(config.handle).toLowerCase();
        }
        const ref = this.isIndex ? (this.parent.isSource ? 'index' : this.parent.name) : config.name;
        return utils.slugify(this.parent.getProp('prefix') ? `${this.parent.getProp('prefix')}-${ref}` : ref).toLowerCase();
    }

    _title(config) {
        return config.title || this.label;
    }

    getContent() {
        return Promise.resolve(this.content);
    }

    getContentSync() {
        return this.content;
    }

    render(context, env, opts) {
        return this.source.render(this, context, env, opts);
    }

    /*
     * Deprecated, do not use!
     */
    renderWithGlobals(context, globals) {
        return this.source.render(this, context, {
            request: globals._request || {},
            server: globals._env.server,
            builder: globals._env.builder,
        });
    }

    toc(maxDepth) {
        return this.source.toc(this, maxDepth);
    }

    static create(config, content, parent) {
        const parsed = matter(content);
        config = _.defaults(parsed.data || {}, config);
        return Promise.resolve(new Doc(config, parsed.content, parent));
    }

    toJSON() {
        const self = super.toJSON();
        self.isDoc = true;
        self.isIndex = this.isIndex;
        self.path = this.path;
        self.status = this.status;
        self.tags = this.tags;
        self.content = this.getContentSync();
        self.lang = this.lang;
        self.file = this.file.toJSON();
        self.context = this.context;
        return self;
    }

};
