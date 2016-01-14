/**
 * Module dependencies.
 */

var path        = require('path');
var logger      = require('winston');
var _           = require('lodash');

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

    /*
     * Run the appropriate service, as specified by the parsed argv parameters
     *
     * @api public
     */

    run: function(argv) {

        this.setPathInfo();
        this.setThemeDetails();
        this.setViewEngine();

        var args = argv._;
        var command = args.shift();
        var opts = argv;
        delete opts._;
        delete opts.$0;

        this.app = require('./application');

        require('./services/run')(command, args, opts);
    },

    /*
     * Set some information about the current path
     *
     * @api private
     */

    setPathInfo: function(){
        this.set('system.paths.root', process.cwd());
    },

    /*
     * Expand the component engine config with the appropriate details.
     *
     * @api private
     */

    setViewEngine: function(){
        var name = this.get('components.view.engine');
        var engine = this.get('engines')[name];
        engine.ext = '.' + _.trim(engine.ext, '.');
        engine.engine = name;
        this.set('components.view.engine', engine);
    },

    /*
     * Fetch theme paths from the theme's json spec and update the theme config info.
     *
     * @api private
     */

    setThemeDetails: function(){
        var theme = this.get('theme');
        var dir = path.parse(require.resolve(theme.name)).dir;
        var themeJSON = require(theme.name);
        ['views','assets','partials','pages'].forEach(function(key){
            theme.paths[key] = path.join(dir, themeJSON[key])
        });
        this.set('theme', theme);
    }

};
