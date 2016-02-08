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
        this.label    = this.isIndex ? props.source.indexLabel : (props.label || utils.titlize(props.name));
        this.title    = props.title || this.label;
        this._raw     = content;
        this._buffer  = props.buffer;
        this._parent  = props.parent;
        this._source  = props.source;
        this._context = props.context || {};
        this.path     = props.path || _.trimStart(`${this._parent.path}/${this.handle}`, '/').replace(/\/index$/, '');

        this._context.title = this._context.title || this.title;
        this._context.label = this._context.label || this.label;
    }
    
    get alias() {
        return null;
    }

    get context() {
        return _.defaultsDeep(this._context, this._parent.context);
    }

    get content() {
        return this._raw;
    }

    get parent() {
        return this._parent;
    }

    static create(props) {
        props.buffer = props.buffer || new Buffer();
        var parsed   = matter(props.buffer.toString('UTF-8'));
        props        = _.defaultsDeep(parsed.data || {}, props);
        return Promise.resolve(new Page(props, parsed.content));
    }

    toJSON() {
        return utils.toJSON(this);
    }
};
