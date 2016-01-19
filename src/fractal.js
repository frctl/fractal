/**
 * Module dependencies.
 */

var logger      = require('winston');
var _           = require('lodash');

var config      = require('../config.js');
var theme       = require('./theme/theme.js');

module.exports = {

    version: config.version,

    env: config.env,

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

    /*
     * Run the appropriate service, as specified by the parsed argv parameters
     *
     * @api public
     */

    run: function(argv) {

        var input = this.parseArgv(argv);

        this.setPathInfo();
        this.setTheme();
        this.setViewEngine();

        require('./services/run')(input.command, input.args, input.opts);
    },

    /*
     * Parse the supplied argv to extract a command, arguments and options
     *
     * @api private
     */

    parseArgv: function(argv){
        var args = argv._;
        var command = args.shift();
        var opts = argv;
        delete opts._;
        delete opts.$0;
        return {
            command: command,
            args: args,
            opts: opts
        }
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
        var engine = this.get('engines.' + name);
        if (!engine) {
            logger.error('Template engine \'%s\' not recognised. Aborting.', name);
            process.exit();
        }
        engine.ext = '.' + _.trim(engine.ext, '.');
        engine.name = engine.engine = name;
        this.set('components.view.engine', engine);
    },

    /*
     * Load the theme.
     *
     * @api private
     */

    setTheme: function(){
        theme.init(this.get('theme').name);
        require('./view')(theme.viewsPath);
    }

};
