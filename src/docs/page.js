'use strict';

const Promise = require('bluebird');
const matter  = require('gray-matter');
const _       = require('lodash');
const utils   = require('../utils');
const Entity  = require('../entity');

module.exports = class Page extends Entity {

    constructor(opts, content) {
        super('page', opts);

        this.id       = utils.md5(opts.filePath);
        this.handle   = this.name;
        this.lang     = opts.lang;
        this.filePath = opts.filePath;
        this.viewPath = this.filePath;
        this.isIndex  = this.name === 'index';
        this.label    = this.isIndex ? opts.source.setting('indexLabel') : (opts.label || utils.titlize(opts.name));
        this.title    = opts.title || this.label;
        this.content  = content;
        this.file     = opts.file;

        console.log(this.path);
    }

    get alias() {
        return null;
    }

    get status() {
        return null;
    }

    getContent() {
        return Promise.resolve(this.content);
    }

    getContentSync() {
        return this.content;
    }

    static create(opts, content) {
        var parsed   = matter(content);
        opts        = _.defaults(parsed.data || {}, opts);
        return Promise.resolve(new Page(opts, parsed.content));
    }

    toJSON() {
        return {
            type:     this.type,
            id:       this.id,
            name:     this.name,
            handle:   this.handle,
            label:    this.label,
            title:    this.title,
            alias:    this.alias,
            order:    this.order,
            isHidden: this.isHidden,
            isIndex:  this.isIndex,
            tags:     this.tags,
            content:  this.getContentSync(),
            lang:     this.lang,
            file:     this.file.toJSON(),
            context:  this.context
        };
    }
};
