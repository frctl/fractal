/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var path        = require('path');
var logger      = require('winston');

var mixin       = require('./entity');
var Variant     = require('./variant');
var utils       = require('../../utils');
var data        = require('../../data');

/*
 * Export the component.
 */

module.exports = Component;

/*
 * Component constructor.
 *
 * - Extract config from config file, if present.
 * - Build component metadata . 
 * - Instantiate and return new component.
 * 
 * @api private
 */

function Component(dir, app){
    var self = this;
    var variants = null;
    var configFile = _.find(dir.getFiles(), function(entity){
        return entity.matches(app.get('components:config'));
    });
    var config = configFile ? data.load(configFile) : {};

    this._app = app;
    this._dir = dir;

    // component level data
    this._config    = config;
    this.type       = 'component';
    this.order      = dir.order;
    this.depth      = dir.depth;
    this.hidden     = !! (config.hidden || dir.hidden);
    this.path       = utils.fauxPath(dir.path);
    this.handle     = config.handle || this.path.replace(/\//g, '-');
    this.label      = config.label || utils.titlize(dir.name);
    this.title      = config.title || this.label;
    this.version    = config.version || app.get('project:version');

    // base variant
    this._base = new Variant("base", config, this);

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
        this.renderView('special', {text: "NEW CONTEXT", modifier: 'foobar'}).then(function(view){
            console.log(view);
        });
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
        variant.handle = variant.handle || (self.handle + '-' + (i + 1));
        variants.push(new Variant(variant.handle, _.defaultsDeep(variant, self._base.toJSON()), self));
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

Component.prototype.getVariant = function(handle){
    handle = handle || 'base';
    var variant = _.find(this.variants, 'handle', handle);
    if (!variant) {
        throw new Error('The variant ' + handle + ' of component ' + this.handle + ' could not be found.');
    }
    return variant;
};

/*
 * Generate the rendered component view.
 * Returns a Promise object.
 *
 * @api public
 */

Component.prototype.renderView = function(handle, context){
    var variant = this.getVariant(handle);
    return variant.renderView(context);
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