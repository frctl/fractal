'use strict';

const Promise = require('bluebird');
const matter  = require('gray-matter');
const _       = require('lodash');
const utils   = require('../../core/utils');
const Entity  = require('../../core/entities/entity');

module.exports = class Doc extends Entity {

    constructor(config, content, parent){
        super(config.name, config, parent);
        this.isDoc    = true;
        this.lang     = config.lang;
        this.filePath = config.filePath;
        this.viewPath = this.filePath;
        this.isIndex  = config.name === 'index';
        this.content  = content;
        this.file     = config.file;
    }

    _label(config) {
        return config.label || (config.isIndex ? this.source.get('indexLabel') : utils.titlize(config.name));
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

    render(context) {
        return this.source.render(this, context);
    }

    static create(config, content, parent) {
        var parsed = matter(content);
        config     = _.defaults(parsed.data || {}, config);
        return Promise.resolve(new Doc(config, parsed.content, parent));
    }

    toJSON(){
        const self   = super.toJSON();
        self.isDoc   = true;
        self.isIndex = this.isIndex;
        self.tags    = this.tags;
        self.content = this.getContentSync();
        self.lang    = this.lang;
        self.file    = this.file.toJSON();
        self.context = this.context;
        return self;
    }

}
