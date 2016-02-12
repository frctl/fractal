'use strict';

const _          = require('lodash');
const utils      = require('./utils');
const Collection = require('./collection');

module.exports = class Entities extends Collection {

    constructor(props, items) {
        super(props, items);
        this.name      = utils.slugify(props.name);
        this.label     = props.label || utils.titlize(props.name);
        this.title     = props.title || this.label;
        this._parent   = props.parent;
        this.order     = props.order;
        this.handle    = this.name;
        this.isHidden  = props.isHidden || false;
        this.context   = _.defaultsDeep(props.context || {}, props.parent.context);
        this.labelPath = props.labelPath || _.trimStart(`${this._parent.labelPath}/${this.label}`, '/');
        this.path      = props.path || _.trimStart(`${this._parent.path}/${this.handle}`, '/');
    }

    get parent() {
        return this._parent;
    }
    
    toJSON(){
        const self    = super.toJSON();
        self.name     = this.name;
        self.label    = this.label;
        self.title    = this.title;
        self.order    = this.order;
        self.path     = this.path;
        self.labelPath = this.labelPath;
        return self;
    }

};
