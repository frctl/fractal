'use strict';

const _        = require('lodash');
const logger   = require('../logger');
const Entities = require('../entities');

module.exports = class ComponentCollection extends Entities {

    constructor(props, items) {
        super(props, items);
    }

    findByPath(path) {
        path = _.trim(path, '/');
        for (let item of this) {
            if (item.type === 'collection') {
                const search = item.findByPath(path);
                if (search) return search;
            } else if (item.path === path) {
                return item;
            }
        }
        return undefined;
    }

};
