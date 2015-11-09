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
var builder     = require('./services/builder/builder');
var Components  = require('./sources/components');
var Pages       = require('./sources/pages');
var data        = require('./data');

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
    this.httpServer = null;
    this.httpServerUrl = null;
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

    if (this.enabled('run:build')) {
        logger.info('Running build...');
        builder.init(this).run();
    }

    if (this.enabled('run:server') || this.disabled('run:build')) {
        this.startServer();
    }

    return this;
};

app.startServer = function(callback){
    callback = callback || function(){};
    var self = this;
    if (!this.httpServer) {
        logger.info('Booting server...');
        server.init(this).listen(function(baseUrl, httpServer){
            self.httpServer = httpServer;
            self.httpServerUrl = baseUrl;
            httpServer.on('close', function(){
                self.httpServer = null;
                self.httpServerUrl = null;
            });
            callback(baseUrl, httpServer);
        });
        
    } else {
        callback(this.httpServerUrl, this.httpServer);
    }
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
    return this.get('statuses:options');
};

/*
 * Return a status object by key, or the default if not found.
 *
 * @api public
 */

app.getStatus = function(status){
    var statuses = this.getStatuses();
    status = status || this.get('statuses:default');
    return _.find(statuses, 'name', status) || _.find(statuses, 'name', this.get('statuses:default'));
};

/*
 * Get the component view engine
 *
 * @api public
 */

app.getComponentViewEngine = function(){
    var engine = this.get('components:engines')[this.get('components:engine')];
    engine.ext = '.' + _.trim(engine.ext, '.');
    engine.engine = this.get('components:engine');
    return engine;
};

/*
 * Loads a component's configuration file.
 *
 * @api public
 */

app.getData = function(path, defaults){
    return data.load(path, defaults);
};

// return this.getComponents().then(function(components){
//         var entity = components.resolve(handle);
//         console.log(entity);
//         return entity._config;
//     }); 

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
        "b": {
            alias: ['build','run:build'],
            describe: 'Run the build task',
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