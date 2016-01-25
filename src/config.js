'use strict';

var _           = require('lodash');
var logger      = require('./logger');
var config      = require('../config.js');

module.exports = {

    /*
     * Set a configuration value.
     *
     * @api public
     */

    set: function(setting, val){
        logger.debug('Setting config value: %s = %s', setting, _.isObject(val) ? JSON.stringify(val, null, 2) : val);
        _.set(config, setting, val);
        return this;
    },

    /*
     * Set a configuration value to true.
     *
     * @api public
     */

    enable: function(setting){
        logger.debug('Enabling %s', setting);
        return _.set(config, setting, true);
    },

    /*
     * Set a configuration value to false
     *
     * @api public
     */

    disable: function(setting){
        logger.debug('Disabling %s', setting);
        return _.set(config, setting, false);
    },

    /*
     * Retrieve a configuration value.
     *
     * @api public
     */

    get: function(setting){
        if (_.isUndefined(setting)) {
            return config;
        }
        return _.get(config, setting);
    },

    /*
     * Check if a configuration value is truthy.
     *
     * @api public
     */

    enabled: function(setting){
        return !!this.get(setting);
    },

    /*
     * Check if a configuration value is falsey.
     *
     * @api public
     */

    disabled: function(setting){
        return !this.get(setting);
    },

};
