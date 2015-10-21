/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var path        = require('path');
var logger      = require('winston');

var mixin       = require('./entity');
var utils       = require('../../utils');
var data        = require('../../data');

/*
 * Export the component.
 */

module.exports = Component;

/*
 * Group constructor.
 *
 * @api private
 */

function Component(dir, meta, app){
    var self = this;
    var variants = null;

    this.type = 'component';
    this._app = app;
    
    this._dir = dir;

    _.forOwn(meta, function(value, key){
        self[key] = value;
    });

    Object.defineProperty(this, 'variants', {
        enumerable: true,
        get: function() {
            if (_.isNull(variants)) {
                variants = self.getVariants();
            }
            return variants;
        }
    });

    // if (!this.hidden) {
        // console.log(this.toString());
        // this.renderView('special').then(function(view){
        //     console.log(view);
        // });
        // this.renderView('swig').then(function(view){
        //     console.log(view);
        // });
        // console.log(this.getVariantFiles('special'));
    // }
};

mixin.call(Component.prototype);

/*
 * Get an array of all the available variants.
 * Includes the base variant, so this will always have a length > 0.
 *
 * @api private
 */

Component.prototype.getVariants = function(){
    var self = this;
    var supplied = this._config.variants || [];
    var variants = [this._base];
    _.each(supplied, function(variant, i){
        if (_.isUndefined(variant.name)) {
            logger.warn('Variant ' + i + ' of component ' + self.name + ' does not have a \'name\' value so will be ignored.');
        } else {
            variant.label = variant.label || utils.titlize(variant.name);
            variant.path = _.isEmpty(variant.cwd) ? self._base.path : path.join(self._dir.path, variant.cwd);
            variants.push(_.defaultsDeep(variant, self._base));
        }
    });
    return variants;
};

/*
 * Get a static, JSON-style object representation of the component.
 * Good for using with templating languages.
 *
 * @api public
 */

Component.prototype.toJSON = function(){
    var obj = {};
    _.forOwn(this, function(value, key){
        if (!_.startsWith(key, '_')) {
            obj[key] = value;
        }
    });
    return obj;
};

/*
 * Get a JSON-formatted string representation of the component.
 *
 * @api public
 */

Component.prototype.toString = function(){
    return JSON.stringify(this.toJSON(), null, 4);
};

/*
 * Get an object describing the specified variant.
 *
 * @api public
 */

Component.prototype.getVariant = function(name){
    name = name || 'base';
    var variant = _.find(this.variants, 'name', name);
    if (!variant) {
        throw new Error('The variant ' + name + ' of component ' + this.name + ' could not be found.');
    }
    return variant;
};

/*
 * Generate the rendered component view.
 * Returns a Promise object.
 *
 * @api public
 */

Component.prototype.renderView = function(variantName){
    try {
        var handler = require(this._app.get('components:view:handler'));    
    } catch (e) {
        var handler = require(path.join('../../', this._app.get('components:view:handler')));
    }
    return handler.render(this.getVariant(variantName), this._app);
};

/*
 * Get an array of files for a variant
 *
 * @api protected
 */

Component.prototype.getVariantFiles = function(variantName){
    var variant = this.getVariant(variantName);
    var dir = variant.cwd ? this._dir.findDirectory('path', variant.path) : this._dir;
    var files = [];
    if (dir) {
        files = dir.getFiles();
    }
    return files;
};

/*
 * Get the contents of one of the component's files, optionally with syntax highlighting.
 * Returns a Promise object.
 *
 * @api public
 */

Component.prototype.getFileContents = function(filename){
    
};

/*
 * Create a new component from a directory.
 *
 * - Extract config from config file, if present.
 * - Build component metadata items. 
 * - Instantiate and return new component.
 * 
 * @api public
 */

Component.createFromDirectory = function(dir, app){

    var meta = {};
    var configFile = _.find(dir.getFiles(), function(entity){
        return entity.matches(app.get('components:config'));
    });

    var config = configFile ? data.load(configFile) : {};

    // component level data
    meta._config    = config;
    meta.order      = dir.order;
    meta.depth      = dir.depth;
    meta.hidden     = !! (config.hidden || dir.hidden);
    meta.path       = utils.fauxPath(dir.path);
    meta.name       = config.name || meta.path.replace(/\//g, '-');
    meta.label      = config.label || utils.titlize(dir.name);
    meta.title      = config.title || meta.label;
    meta.version    = config.version || app.get('project:version');

    // base variant
    meta._base = {
        name:       "base",
        label:      "Base",
        cwd:        config.cwd || null,
        engine:     config.engine || app.get('components:view:engine'),
        path:        _.isEmpty(config.cwd) ? dir.path : path.join(dir.path, config.cwd),
        context:    config.context || {},
        display:    config.display || {},
        status:     config.status || app.get('statuses:default'),
        layout:     config.layout || null,
        view:       (config.view || app.get('components:view:file')).replace('{{name}}', dir.name),
        notes:      config.notes || null,
    };

    return new Component(dir, meta, app).init();
};