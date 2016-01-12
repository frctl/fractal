/**
 * Module dependencies.
 */

var nconf       = require('nconf');
var path        = require('path');
var Promise     = require('bluebird');
var logger      = require('winston');
var chalk       = require('chalk');
var _           = require('lodash');
var chokidar    = require('chokidar');

var server      = require('./services/server/server');
var build       = require('./services/builder/builder');
var generate    = require('./services/generator/generator');
var init        = require('./services/init');
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
    this._monitors      = [];
    this._components    = null;
    this._pages         = null;
    this._httpServer    = null;
    this.server         = null;
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
 * Determine which service to run.
 *
 * @api public
 */

app.run = function(argv){

    this.server = server(this);

    switch (argv._[0]) {
        case 'start':
            this.runServerService(argv);
            break;
        case 'build':
            build(this);
            break;
        case 'create':
            generate(argv, this);
            break;
        case 'init':
            init(argv, this);
            break;
        default:
            logger.error('Unrecognised command.');
            process.exit(1);
            break;
    }
};

/*
 * Run the server.
 *
 * @api private
 */

app.runServerService = function(argv){
    if (argv.port) {
        this.set('server:port', argv.port);
    }
    this.startServer();
};

/*
 * Start the server, if it isn't already running
 *
 * @api protected
 */

app.startServer = function(callback){
    var callback = callback || function(){};
    var port = this.get('server:port') || 3000;
    if (!this._httpServer) {
        this._httpServer = this.server.listen(port, function(){
            console.log(chalk.green('Fractal server is now running at http://localhost:' + port + ' - use ^c to exit.'));
            callback();
        });
    } else {
        callback();
    }
};

/*
 * Stop the server, if it is running
 *
 * @api protected
 */

app.stopServer = function(callback){
    var callback = callback || function(){};
    if (this._httpServer) {
        this._httpServer.close(function(){
            logger.info('Fractal server is shutting down.');
            callback();
        });
        this._httpServer = null;
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
    if (!this._pages) {
        if (this.get('pages:path')) {
            var self = this;
            var pages = Pages.build(this.get('pages:path'), this);
            var themePages = this.getThemePages();

            this._pages = Promise.join(pages, themePages, function(pages, themePages){
                pages.setDefaults(themePages);
                return pages;
            });
            this.createMonitor(this.get('pages:path'), function(event, path) {
                self._pages = null;
            });
        } else {
            this._pages = this.getThemePages();
        }
    }
    return this._pages;
};

/*
 * Return a collection of default, theme-provided pages for fallbacks
 *
 * @api public
 */

app.getThemePages = function(){
    if (!this._defaultPages) {
        this._themePages = Pages.build(this.get('theme:paths:pages'), this);
    }
    return this._themePages;
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

/*
 * Setup the initial app configuration.
 *
 * @api private
 */

app.defaultConfig = function(){
    nconf.file({
        file: path.join(__dirname + '/../config.json')
    });

    var theme = this.get('theme');
    var dir = path.parse(require.resolve(theme.name)).dir;
    var themeJSON = require(theme.name);
    theme.paths = {
        views: path.join(dir, themeJSON.views),
        assets: path.join(dir, themeJSON.assets),
        partials: path.join(dir, themeJSON.partials),
        pages: path.join(dir, themeJSON.pages),
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
