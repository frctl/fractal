/**
 * Module dependencies.
 */

var nconf       = require('nconf');
var path        = require('path');
var Promise     = require('bluebird');
var logger      = require('winston');
var _           = require('lodash');
var chokidar    = require('chokidar');

var server      = require('./services/server/server');
var exporter    = require('./services/exporter/exporter');
var Components  = require('./sources/components');
var Pages       = require('./sources/pages');

/*
 * Export the app.
 */

var app = exports = module.exports = {};

/*
 * Initialise the application.
 *
 * @api private
 */

app.init = function(){
    this._monitors = [];
    this._components = null;
    this.defaultConfig();
};

/*
 * Set a configuration value.
 *
 * @api public
 */

app.set = function(setting, val){
    nconf.set(setting, val);
    return this;
};

/*
 * Set a configuration value to true.
 *
 * @api public
 */

app.enable = function(setting){
    return nconf.set(setting, true);
};

/*
 * Set a configuration value to false
 *
 * @api public
 */

app.disable = function(setting){
    return nconf.set(setting, false);
};

/*
 * Retrieve a configuration value.
 *
 * @api public
 */

app.get = function(setting){
    return nconf.get(setting);
};

/*
 * Check if a configuration value is truthy.
 *
 * @api public
 */

app.enabled = function(setting){
    return !!this.get(setting);
};

/*
 * Check if a configuration value is falsey.
 *
 * @api public
 */

app.disabled = function(setting){
    return !this.get(setting);
};

/*
 * Run the application! Yay!
 *
 * @api public
 */

app.run = function(){

    logger.level = this.get('log:level');

    if (this.enabled('run:exporter')) {
        logger.info('Running exporter...');
        exporter.init(this).export();
    }

    if (this.enabled('run:server') || this.disabled('run:exporter')) {
        logger.info('Booting server...');
        server.init(this).listen();
    }

    return this;
};

/*
 * Return a collection of components based on the config path.
 *
 * @api public
 */

app.getComponents = function(){
    if (!this._components) {
        var self = this;
        this._components = Components.build(this);
        this.createMonitor(this.get('components:path'), function(event, path) {
            // TODO: make this tree rebuilding more refined rather than all or nothing.
            self._components = null;
        });
    }
    return this._components;
};

/*
 * Return a collection of pages based on the config path.
 *
 * @api public
 */

app.getPages = function(){
    // TODO: implement pages
    return Promise.resolve([]);
};

/*
 * Return the set of available statuses.
 *
 * @api public
 */

app.getStatuses = function(){
    return this.get('statuses');
};

/*
 * Return a status object by key, or the default if not found.
 *
 * @api public
 */

app.getStatus = function(status){
    var statuses = this.getStatuses();
    return statuses[status] || _.find(statuses, 'default', true);
};

/*
 * Setup the initial app configuration.
 *
 * @api private
 */

app.defaultConfig = function(){
    nconf.argv({
        "s": {
            alias: ['serve','run:server'],
            describe: 'Run the server',
            default: false
        },
        "e": {
            alias: ['export','run:exporter'],
            describe: 'Run the exporter',
            default: false
        }
    }).env().file({
        file: path.join(__dirname + '/../config.json')
    });

    var theme = this.get('theme');
    var dir = path.parse(require.resolve(theme.name)).dir;
    var themeJSON = require(theme.name);
    theme.paths = {
        views: path.join(dir, themeJSON.views),
        assets: path.join(dir, themeJSON.assets),
        partials: path.join(dir, themeJSON.partials),
    };
    this.set('theme', theme);
};

/*
 * Create a directory monitor with callback.
 *
 * @api private
 */

app.createMonitor = function(path, callback){
    var monitor = chokidar.watch(path, {
        ignored: /[\/\\]\./
    });
    monitor.on('ready', function(){
        monitor.on('all', callback);
    });
    this._monitors[path] = monitor;
};