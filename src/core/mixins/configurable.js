'use strict';

const _ = require('lodash');

let Configurable = (superclass) => class extends (superclass || Object) {

    constructor(config) {
        super();
        this._config = config || {};
    }

    set(config, val) {
        _.set(this._config, config, val);
        return this;
    }

    get(config, defaultVal) {
        if (_.isUndefined(config)) {
            return this._config;
        }
        return _.get(this._config, config, defaultVal || undefined);
    }

};

module.exports = Configurable;
