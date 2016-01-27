'use strict';

const Promise = require('bluebird');
const matter  = require('gray-matter');
const _       = require('lodash');
const utils   = require('../utils');
const config  = require('../config');

module.exports = class Page {

    constructor(props, content) {
        this.type     = 'page';
        this._raw     = content;
        this._config  = props;
        this._buffer  = props.buffer;
        this.name     = props.name;
        this.order    = props.order;
        this.isHidden = props.isHidden;
        this.isIndex  = this.name.toLowerCase() === 'index';
        this.lang     = props.lang;
        this.label    = this.isIndex ? config.get('pages.indexLabel') : props.label || utils.titlize(props.name);
        this.title    = props.title || this.label;
        this.context  = props.context || {};
    }

    static create(props){
        props.buffer = props.buffer || new Buffer();
        var parsed   = matter(props.buffer.toString('UTF-8'));
        props        = _.defaultsDeep(parsed.data || {}, props);
        return Promise.resolve(new Page(props, parsed.content));
    }

    toJSON(){
        return utils.toJSON(this);
    }
}
