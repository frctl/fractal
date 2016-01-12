/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var path        = require('path');
var fs          = require('fs');

var mixin       = require('./entity');
var utils       = require('../../utils');
var md          = require('../../markdown');
var app         = require('../../application');

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

    var self                = this;
    var context             = null;

    this._app               = app;
    this._config            = config;
    this._files             = config.files || [];
    this._component         = parent;
    this._source            = parent._source;

    this.type               = 'variant';
    this.handle             = handle;
    this.fullHandle         = '@' + parent.handle + ':' + this.handle;
    this.label              = config.label || utils.titlize(handle);
    this.title              = config.title || this.label;
    // this.fsPath             = parent.fsPath;
    // this.path               = parent.path;
    this.handlePath         = parent.handlePath + '--' + this.handle;
    this.context            = config.context || {};
    this.display            = config.display || {};
    this.hidden             = config.hidden || false;
    this.status             = app.getStatus(config.status);
    this.preview            = config.preview || null;
    this.notes              = config.notes ? md(config.notes) : null;
    this.ext                = parent.viewExt;
    this.view               = path.parse(config.view).name + this.ext;
    this.engine             = parent.engine;

    if (parent.sourceType == 'directory') {
        this.fsViewPath = path.resolve(path.join(app.get('components:path'), parent._source.path, this.view));
    } else {
        this.fsViewPath = path.resolve(path.join(app.get('components:path'), parent._source.relativeDir, this.view));
    }

    this.contextString      = null;
    this.rendered           = null;
    this.renderedInLayout   = null;

    this.files = {
        view: _.find(this._files, 'fsBase', this.view),
        other: _.reject(this._files, 'fsBase', this.view),
    };

    try {
        var stats = fs.lstatSync(this.fsViewPath);
    } catch (e) {
        throw new Error('Variant view not found (path searched: ' + this.fsViewPath + ')');
    }

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
    // this.contextString = this.getContextString();
    return self;
};

/*
 * Generate the rendered variant view.
 * Returns a Promise object.
 *
 * @api public
 */

Variant.prototype.renderView = function(context, preview){
    var self = this;
    var context = resolveContextReferences(context || self.context, this._app);
    return context.then(function(context){
        var engine = self._app.get('components:engine');
        try {
            var renderer = require(engine.handler);
        } catch (e) {
            var renderer = require(path.join('../../', engine.handler));
        }
        return preview ? renderer.renderPreview(self, context, self._app) : renderer.render(self, context, self._app);
    });
};

/*
 * Get a list of supporting files.
 *
 * @api public
 */

Variant.prototype.preRender = function(){
    var self = this;
    var rendered = this.renderView(null, false);
    var renderedPreview = this.renderView(null, true);
    var contextString = this.getContextString();
    return Promise.join(rendered, renderedPreview, contextString, function(rendered, renderedPreview, contextString){
        self.rendered = rendered;
        self.renderedPreview = renderedPreview;
        self.contextString = contextString;
        return self;
    });
};

/*
 * Get a list of supporting files.
 *
 * @api public
 */

Variant.prototype.getFiles = function(){
    return this._files;
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

Variant.prototype.getContextString = function(){
    if (_.isEmpty(this.context)) {
        return Promise.resolve(null);
    }
    return resolveContextReferences(this.context, this._app).then(function(c){
        return JSON.stringify(c, null, 4);
    });
};

/*
 * Takes a context object and resolves any references to other variants
 *
 * @api public
 */

function resolveContextReferences(context, app) {
    return app.getComponents().then(function(components){

        function resolve(obj) {
            return _.mapValues(obj, function(val, key){
                if (_.isObject(val)) {
                    return resolve(val);
                }
                if (_.startsWith(val, '@')) {
                    var entity = components.resolve(val);
                    if (entity) {
                        if (entity.type == 'component') {
                            entity = entity.getVariant();
                        }
                        return entity.context;
                    } else {
                        logger.warn("Could not resolve data reference for " + val);
                    }
                }
                return val;
            });
        }

        return resolve(context);
    });
}
