'use strict';

const EventEmitter = require('events').EventEmitter;
const Promise      = require('bluebird');
const _            = require('lodash');
const utils        = require('./utils');
const Collection   = require('./collection');

class Source extends Collection {

    constructor(props, items){
        super(props, items);
        this.name      = utils.slugify(props.name);
        this.label     = props.label || utils.titlize(props.name);
        this.title     = props.title || this.label;
        this._defaults = {};
        this._defaults.context = _.cloneDeep(props.context || {});
        this._context = _.cloneDeep(props.context || {});
        this.labelPath = '';
        this.path = '';
        this.emit('ready', this.items());
    }

    setItems(items) {
        this._items = new Set(items || []);
        this.emit('changed', this.items());
        return this;
    }

    flatten() {
        return new Collection({}, this.flattenItems(this.items()));
    }

    squash(){
        return new Collection({}, this.squashItems(this.items()));
    }

    filter(predicate){
        return new Collection({}, this.filterItems(this.items(), predicate));
    }

    set context(context) {
        this._context = _.defaultsDeep(context, this._defaults.context);
    }

    get context() {
        return this._context;
    }

}

_.extend(Source.prototype, EventEmitter.prototype);

module.exports = Source;
