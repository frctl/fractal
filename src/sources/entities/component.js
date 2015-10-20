/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var logger      = require('winston');

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
    this.type = 'component';
    this._app = app;
    this._variants = null;
    this._files = files;
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
    var self = this;
    if (!this._variants) {
        var supplied = _.isEmpty(this._config.variants) ? [] : this._config.variants;
        var variants = [{
            name:       'base',
            label:      'Base',
            status:     this.status,
            view:       this.view,
            layout:     this.layout,
            context:    this.context,
            display:    this.display,
            notes:      this.notes,
        }];
        _.each(supplied, function(variant, i){
            if (_.isUndefined(variant.name)) {
                logger.warn('Variant ' + i + ' of component ' + self.name + ' does not have a name value so will be ignored.');
            } else {
                variant.label = variant.label || utils.titlize(variant.name);
                variants.push(_.defaultsDeep(variant, variants[0]));
            }
        });
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
 * - Extract config from config file, if present.
 * - Build component metadata items. 
 * - Instantiate and return new component.
 * 
 * @api public
 */

Component.createFromDirectory = function(dir, app){

    var meta = {};
    var files = dir.children;
    var configFile = _.find(files, function(entity){
        return (entity.isFile() && entity.matches(app.get('components').config));
    });
    
    var config = configFile ? dataParser.fromFile(configFile) : {};

    // component level data
    meta._config    = config;
    meta.order      = dir.order;
    meta.depth      = dir.depth;
    meta.hidden     = !! (config.hidden || dir.hidden);
    meta.path       = utils.fauxPath(dir.path);
    meta.name       = config.name || meta.path.replace(/\//g, '-');
    meta.label      = config.label || utils.titlize(dir.name);
    meta.title      = config.title || meta.label;

    // variant level data
    meta.context    = config.context || {};
    meta.display    = config.display || {};
    meta.status     = config.status || _.findKey(app.get('statuses'), 'default', true);
    meta.layout     = config.layout || null;
    meta.view       = (config.view || app.get('components').view.file).replace('{{name}}', dir.name);
    meta.notes      = config.notes || null;
    
    return new Component(files, meta, app).init();
};