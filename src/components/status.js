'use strict';

const _       = require('lodash');
const config  = require('../config');
const logger  = require('../logger');
const options = config.get('components.status.options');
const def     = config.get('components.status.default');

module.exports = function status(label){
    if (_.isArray(label)) {
        return _.compact(label.map(l => status(l)));
    }
    if (_.isUndefined(label)) {
        return null;
    }
    if (!options[label]) {
        logger.error(`Status ${label} is not a known option.`);
        return options[def];
    }
    return options[label];
};

module.exports.options = options;
