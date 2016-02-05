'use strict';

const _       = require('lodash');
const config  = require('../config');
const logger  = require('../logger');

const options = config.get('components.status.options');
const def     = config.get('components.status.default');
const mixed   = config.get('components.status.mixed');

module.exports = function status(handle) {
    if (_.isArray(handle)) {
        return _.compact(handle.map(l => status(l)));
    }
    if (_.isUndefined(handle)) {
        return null;
    }
    if (handle == mixed.handle) {
        return mixed;
    }
    if (!options[handle]) {
        logger.error(`Status ${handle} is not a known option.`);
        return options[def];
    }
    return options[handle];
};

module.exports.options = options;
