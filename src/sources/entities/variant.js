/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var path        = require('path');
var fs          = require('fs');

var mixin       = require('./entity');
var utils       = require('../../utils');

/*
 * Export the variant.
 */

module.exports = Variant;

/*
 * Variant constructor.
 * 
 * @api private
 */

function Variant(handle, config, parent){
    if (_.isUndefined(handle)) {
        throw new Error('No handle defined for variant of ' + parent.handle);
    }
    var self        = this;
    var app         = this._app = parent._app; 
    this.type       = 'variant';
    this._config    = config;
    this.handle     = handle;
    this.fullHandle = '@' + parent.handle + '::' + this.handle;
    this.cwd        = config.cwd || null;
    this._component = parent;
    this._dir       = parent._dir;

    if (this.cwd) {
        var variantPath = path.join(this._dir.path, this.cwd);
        this._dir = this._dir.findDirectory('path', variantPath);
        if (!this._dir) {
            // TODO: better variant path error handling?
            throw new Error('Variant directory ' + variantPath + ' not found');
        }
    }

    this.label          = config.label || utils.titlize(handle);
    this.title          = config.title || this.label;
    this.path           = utils.fauxPath(this._dir.path);
    this.fsPath         = this._dir.path; 
    this.ext            = config.ext ||  app.get('components:view:ext'); 
    this.view           = null;
    
    var viewNames = config.view || app.get('components:view:file');

    if (!_.isArray(viewNames)) {
        viewNames = [viewNames];
    }

    for (var i = 0; i < viewNames.length; i++) {
        var viewName = viewNames[i].replace('{{component}}', parent.handle).replace('{{variant}}', this.handle);
        var view = path.parse(viewName).name + this.ext;
        var fsViewPath = path.join(app.get('components:path'), this.fsPath, view);
        try {
            var stats = fs.lstatSync(path.resolve(fsViewPath));
            if (stats){
                this.view = view;
                this.fsViewPath = fsViewPath;
                break;
            }
        } catch (e) {}
    };

    if (this.view == null) {
        throw new Error('Variant view not found');
    }
    
    this.viewPath       = path.join(app.get('components:path'), this.path, this.view);
    this.context        = config.context || {};
    this.display        = config.display || {};
    this.status         = app.getStatus(config.status);
    this.preview        = config.preview || app.get('components:preview:layout');
    this.engine         = config.engine || app.get('components:view:engine');
    this.notes          = config.notes || null;
    this.rendered       = null;
    this.files          = {
        view: _.find(this.getFiles(), 'base', this.view)
    };
};

mixin.call(Variant.prototype);

/*
 * Generate the rendered variant view.
 * Returns a Promise object.
 *
 * @api public
 */

Variant.prototype.init = function(siblings){
    var self = this;
    var viewFiles = _.map(siblings, function(sibling){
        return sibling.files.view;
    });
    this.files.other = _.reject(this.getFiles(), function(file){
        return _.contains(_.values(self.files).concat(viewFiles), file);
    });
    return self;
};

/*
 * Generate the rendered variant view.
 * Returns a Promise object.
 *
 * @api public
 */

Variant.prototype.renderView = function(context, preview){
    context = context || this.context;
    try {
        var renderer = require(this._app.get('components:view:handler'));    
    } catch (e) {
        var renderer = require(path.join('../../', this._app.get('components:view:handler')));
    }
    return preview ? renderer.renderPreview(this, context, this._app) : renderer.render(this, context, this._app);
};

/*
 * Get a list of supporting files.
 *
 * @api public
 */

Variant.prototype.preRender = function(preview){
    var self = this;
    return this.renderView(null, preview).then(function(rendered){
        self.rendered = rendered;
        return self;
    });
};

/*
 * Get a list of supporting files.
 *
 * @api public
 */

Variant.prototype.getFiles = function(){
    return this._dir.getFiles();
};

/*
 * Get a file object for one of the variant's support files.
 *
 * @api public
 */

Variant.prototype.getFile = function(baseName){
    var file = _.find(this.getFiles(), 'base', baseName);
    if (!file) {
        throw new Error('File ' + baseName + ' not found for variant ' + this.handle);
    }
    return file;
};

/*
 * Get a stringified version of the variant's context
 *
 * @api public
 */

Variant.prototype.getContextString = function(baseName){
    return JSON.stringify(this.context, null, 4);
};