/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var path        = require('path');

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
    var app         = this._app = parent._app;
    this.type       = 'variant';
    this.handle     = handle;
    this.cwd        = config.cwd || null;
    this._component = parent;
    this._dir       = parent._dir;

    if (this.cwd) {
        var variantPath = path.join(this._dir.path, this.cwd);
        this._dir = this._dir.findDirectory('path', variantPath);
        if (!this._dir) {
            // TODO: better variant path error handling
            throw new Error('Variant directory ' + variantPath + ' not found');
        }
    }

    this.label          = config.label || utils.titlize(handle);
    this.path           = utils.fauxPath(this._dir.path);
    this.fsPath         = this._dir.path;
    this.view           = (config.view || app.get('components:view:file')).replace('{{name}}', this._dir.name);
    this.viewPath       = path.join(app.get('components:path'), this.path, this.view);
    this.fsViewPath     = path.join(app.get('components:path'), this.fsPath, this.view);
    this.context = config.context || {};
    this.display        = config.display || {};
    this.status         = config.status || app.get('statuses:default');
    this.preview        = config.preview || app.get('components:preview:layout');
    this.engine         = config.engine || app.get('components:view:engine');
    this.notes          = config.notes || null;
};

mixin.call(Variant.prototype);

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
