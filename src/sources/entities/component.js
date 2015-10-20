/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');

var mixin       = require('./entity');
var collector   = require('../../filesystem/collector');
var utils       = require('../../utils');
var dataParser  = require('../../data');

/*
 * Export the component.
 */

module.exports = Component;

/*
 * Group constructor.
 *
 * @api private
 */

function Component(files, meta, app){
    var self = this;
    this._app = app;
    this._variants = null;
    this.type = 'component';
    this._files = files;
    _.defaults(this, meta);
    console.log(this.title);
};

mixin.call(Component.prototype);

/*
 * Get an array of all the available variants.
 * Includes the base variant, so this will always have a length > 0.
 *
 * @api public
 */

Component.prototype.getVariants = function(){
    if (!this._variants) {
        var supplied = this._config.variants || []
        var variants = {};
        var base = {
            name:       'base',
            label:      'Base',
            status:     this.status,
            layout:     this.layout,
            context:    this.context,
            preview:    this.preview,
            notes:      this.notes,
        };
        _.each(supplied, function(variant, key){
            variant.name = key;
            variant.label = variant.label || utils.titlize(key);
            variants[key] = _.defaultsDeep(variant, base);
        });
        variants.base = variants.base || base;
        this._variants = variants;
    }
    return this._variants;
};

/*
 * Get a object representing the status of the component.
 *
 * @api public
 */

Component.prototype.getStatus = function(){
    return this._app.getStatus(this.status);
};

/*
 * Get the contents of a component file.
 * Will return merge file content if more that one of those type are available.
 * Contents will be passed through the any specified handlers.
 *
 * @api public
 */

Component.prototype.getFileContents = function(type, highlighted){
    var files = this._files[type].matched;
    if (_.isEmpty(files)) {
        return null;
    }

};

/*
 * Get a JSON object representation of the component.
 * Good for using with templating languages.
 *
 * @api public
 */

Component.prototype.toJSON = function(){
    // TODO
};

/*
 * Create a new component from a directory.
 *
 * - Collect files according to type.
 * - Extract data from data file, if present.
 * - Build component metadata items. 
 * - Instantiate and return new component.
 * 
 * @api public
 */

Component.createFromDirectory = function(dir, app){

    var config = {};
    var files = dir.children;
    var configFile = _.first(files, function(entity){
        return entity.isFile() && entity.matches(app.get('components').config.name);
    });
    
    if (configFile) {
        config = _.defaultsDeep(config, dataParser.fromFile(configFile), app.get('components').config.defaults);
    }

    var meta        = {}
    meta.path       = utils.fauxPath(dir.path);
    meta.name       = config.name || meta.path.replace(/\//g, '-');
    meta.title      = config.title || utils.titlize(dir.name);
    meta.label      = config.label || meta.title;
    meta.order      = dir.order;
    meta.depth      = dir.depth;
    meta.hidden     = !! (config.hidden || dir.hidden);
    // meta.context    = config.context || {};
    // meta.status     = config.status || _.findKey(app.get('statuses'), 'default', true);
    // meta.layout     = config.layout || null;
    // meta.preview    = config.preview || {};
    // meta.notes      = config.notes || null;
    // meta._data      = data;

    return new Component(files, meta, app).init();
};