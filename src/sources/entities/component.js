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
    this.files = files;
    _.defaults(this, meta);
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
        var supplied = this._data.variants || []
        var variants = {};
        var base = {
            name:       'base',
            title:      'Base',
            status:     this.status,
            layout:     this.layout,
            context:    this.context,
            preview:    this.preview,
            notes:      this.notes,
        };
        _.each(supplied, function(variant, key){
            variant.name = key;
            variant.title = variant.title || utils.titlize(key);
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
 * Get any notes associated with the component.
 *
 * @api public
 */

Component.prototype.toJSON = function(){
    // TODO
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

    var config = app.get('components');

    if (_.isUndefined(config.files['preview'])) {
        throw new Error('No preview file definition found');
    }

    var files = collector.collectFiles(dir.children, _.clone(config.files), {
        name: dir.name
    }, true);

    if (!files.preview.matched) {
        throw new Error('No preview file found');
    }

    var previewFile = files.preview.matched;
    var data = files['data'].matched ? dataParser.fromFile(files['data'].matched) : {};

    var meta        = {}
    meta.path       = utils.fauxPath(dir.path);
    meta.name       = data.name || meta.path.replace(/\//g, '-');
    meta.title      = data.title || utils.titlize(dir.name);
    meta.label      = data.label || meta.title;
    meta.order      = dir.order;
    meta.depth      = dir.depth;
    meta.hidden     = !! (data.hidden || previewFile.hidden);
    meta.context    = data.context || {};
    meta.status     = data.status || _.findKey(app.get('statuses'), 'default', true);
    meta.layout     = data.layout || null;
    meta.preview    = data.preview || {};
    meta.notes      = data.notes || null;
    meta._data      = data;

    return new Component(files, meta, app).init();
};