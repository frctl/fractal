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
    this.fsPath     = dir.path;
    this.path       = utils.fauxPath(dir.path);
    this.handle     = config.handle || utils.fauxPath(dir.name);
    this.label      = config.label || utils.titlize(dir.name);
    this.title      = config.title || this.label;
    this.version    = config.version || app.get('project:version');

    // base variant
    this._base = new Variant('base', config, this);

    Object.defineProperty(this, 'variants', {
        enumerable: true,
        get: function() {
            if (_.isNull(variants)) {
                variants = self.getVariants();
            }
            return variants;
        }
    });
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
        try {
            var config = _.defaultsDeep(variant, _.cloneDeep(self._config))
            delete config.variants;
            variants.push(new Variant(variant.handle, config, self));    
        } catch(e) {
            logger.error('Variant of ' + self.handle + ' could not be created: ' + e.message );
        }
    });
    return variants;
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
 * Generate a rendered view of a variant.
 * Returns a Promise object.
 *
 * @api public
 */

Component.prototype.renderView = function(context, preview, handle){
    var variant = this.getVariant(handle);
    return variant.renderView(context, preview);
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