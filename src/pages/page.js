'use strict';

const Promise = require('bluebird');
const matter  = require('gray-matter');
const _       = require('lodash');
const utils   = require('../utils');

module.exports = class Page {

    constructor(props, content) {
        this.type     = 'page';
        this.name     = utils.slugify(props.name.toLowerCase());
        this.handle   = this.name;
        this.isIndex  = this.name === 'index';
        this.lang     = props.lang;
        this.order    = props.order;
        this.isHidden = props.isHidden;
        this.filePath = props.filePath;
        this.viewPath = this.filePath;
        this.label    = this.isIndex ? props.source.indexLabel : (props.label || utils.titlize(props.name));
        this.title    = props.title || this.label;
        this.content  = content;
        this.file     = props.file;
        this._parent  = props.parent;
        this._source  = props.source;
        this._context = props.context || {};
        this.path     = props.path || _.trim(_.trimStart(`${this._parent.path}/${this.handle}`, '/').replace('index', ''), '/');

        this._tags       = props.tags || [];
        this._context.title = this._context.title || this.title;
        this._context.label = this._context.label || this.label;
    }

    get alias() {
        return null;
    }

    get context() {
        return _.defaultsDeep(this._context, this._parent.context);
    }

    get parent() {
        return this._parent;
    }

    get tags() {
        return _.uniq(_.concat(this._tags, this._parent.tags));
    }

    static create(props, content) {
        var parsed   = matter(content);
        props        = _.defaults(parsed.data || {}, props);
        return Promise.resolve(new Page(props, parsed.content));
    }

    toJSON() {
        return {
            type:     this.type,
            name:     this.name,
            handle:   this.handle,
            label:    this.label,
            title:    this.title,
            alias:    this.alias,
            order:    this.order,
            isHidden: this.isHidden,
            isIndex:  this.isIndex,
            tags:     this.tags,
            content:  this.content,
            lang:     this.lang,
            file:     this.file.toJSON(),
            context:  this.context
        };
    }
};
