'use strict';

const _          = require('lodash');
const utils      = require('./utils');
const Collection = require('./collection');

module.exports = class Entities extends Collection {

    constructor(opts, items) {
        super(items);

        this._parent   = opts.parent;
        this.name      = opts.name ? utils.slugify(opts.name) : 'collection';
        this.label     = opts.label || utils.titlize(opts.name);
        this.title     = opts.title || this.label;
        this.handle    = this.name;
        this.order     = parseInt(opts.order, 10) || 10000;
        this.isHidden  = opts.isHidden || false;

        this.setProps(opts);
    }

    getProp(key) {
        const upstream = this.parent.getProp(key);
        const prop    = this._props.get(key)
        return utils.mergeProp(prop, upstream);
    }

    get parent() {
        return this._parent;
    }

    get source() {
        return this._parent.source;
    }

    toJSON() {
        const self     = super.toJSON();
        self.name      = this.name;
        self.label     = this.label;
        self.title     = this.title;
        self.order     = this.order;
        self.path      = this.path;
        self.labelPath = this.labelPath;
        return self;
    }

};
