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
var md          = require('../../markdown');

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

function Component(entity, files, config, app){

    var self                = this;
    var engine              = app.getComponentViewEngine();
    
    this._app               = app;
    this._source            = entity;
    this._files             = files;
    this._config            = _.cloneDeep(config);

    this.readme             = null;
    this.default            = null;
    this.variants           = null;
    this.sourceType         = entity.type;
    this.type               = 'component';
    this.order              = entity.order;
    this.depth              = entity.depth;
    this.hidden             = !! (config.hidden || entity.hidden);
    this.fsPath             = entity.path;
    this.path               = utils.fauxPath(entity.path);
    this.handlePath         = this.path;
    this.handle             = config.handle || utils.fauxPath(entity.name);
    this.fullHandle         = '@' + this.handle;
    this.label              = config.label || utils.titlize(entity.name);
    this.title              = config.title || this.label;
    this.defaultHandle      = config.default || 'default';
    this.viewExt            = engine.ext;

    this.variantDefaults = {
        status:     config.status || app.get('statuses:default'),
        context:    config.context || {},
        preview:    config.preview || app.get('components:preview:layout'),
        display:    config.display || {},
        view:       config.view || (entity.name + this.viewExt)
    };
};

mixin.call(Component.prototype);

/*
 * Initialise the component.
 * Returns a promise.
 *
 * @api private
 */

Component.prototype.init = function(){
    var self = this;
    var variants        = this.getVariants();
    this.readme         = this.getReadme();
    return Promise.join(variants, function(variants){
        self.variants = variants;
        self.default  = _.find(variants, 'handle', self.defaultHandle);
        self.status   = self.getStatuses();
        return self;
    });
};

/*
 * Build the default variant object
 *
 * @api private
 */

// Component.prototype.initDefaultVariant = function(){

//     // Get any config specified in the array of variants
//     // and merge with any defaults that are set 
//     var variantConfig = _.find(this._config.variants || {}, 'handle', this.defaultHandle) || {};
//     var config = _.defaults(variantConfig, this.variantDefaults);
    
//     return (new Variant(this.defaultHandle, this._files, config, this)).init();
// };

/*
 * Get an array of all the available variants.
 * Includes the default variant, so this will always have a length > 0.
 *
 * @api private
 */

Component.prototype.getVariants = function(){
    if (this.variants) {
        return this.variants;
    }
    var self = this;
    var variants = [];
    var splitter = self._app.get('components:variantSplitter');
    var configs = _.map(this._config.variants || [], function(config){
        if (!_.isUndefined(config.handle)) {
            return makeVariantConfig(config.handle, config);
        } else {
            logger.error('Variant of ' + config.handle + ' could not be created: ' + e.message );
        }
    });

    function makeVariantConfig(handle, variantConf, files){
        // is there a variant-specific config file?
        var configFile = _.find(files, function(entity){
            return entity.matches(self._app.get('components:config'), {
                name: self.handle + splitter + handle
            });
        });
        var specificConfig = configFile ? data.load(configFile.absolutePath) : Promise.resolve({});
        return specificConfig.then(function(spec){
            return _.defaultsDeep(spec, variantConf, self.variantDefaults);
        });
    }

    // Generate configs for any files that look like a variant but don't have config specified.
    _.each(this._files, function(file){
        if (file.base == self.variantDefaults.view) {
            // it's the default variant's view
            if (!_.find(configs, 'handle', self.defaultHandle)) {
                var variantConf = {
                    handle: self.defaultHandle,
                };
                configs.unshift(makeVariantConfig(self.defaultHandle, variantConf, self._files));
            }
        } else {
            // Does the file match the expected variant view filename pattern?
            var matches = file.matches('^' + self.handle + '{{splitter}}.*{{ext}}$', {
                splitter: splitter,
                ext: self.viewExt
            });
            if (matches) {
                var parts = file.match('^' + self.handle + '{{splitter}}(.*){{ext}}$', {
                    splitter: splitter,
                    ext: self.viewExt
                });
                if (parts && !_.find(configs, 'handle', parts[1])) {
                    // no configuration for this variant view yet so push it onto the stack
                    var variantConf = {
                        handle: parts[1],
                        view: file.base
                    };
                    configs.push(makeVariantConfig(parts[1], variantConf, self._files));
                }
            }
        } 
    });

    if (this.sourceType == 'directory') {
        // also check the subdirectories to see if any of those contain variants
        var subDirs = this._entity.getDirectories();
        
    }

    return Promise.all(configs).then(function(configs){
        
        // Now generate some variant objects from the configs
        
        return _.map(configs, function(config){
            return (new Variant(config.handle, config, self)).init();
        });

    });
};

/*
 * Get an object describing the specified variant.
 *
 * @api public
 */

Component.prototype.getVariant = function(handle){
    handle = handle || this.defaultHandle;
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
 * Pre-render all variants.
 * Useful for running before .toJSON() to provide a one-hit promise-based rendering of variants.
 * Returns a promise of self. 
 *
 * @api public
 */

Component.prototype.renderAll = function(){
    var self = this;
    var promises = _.map(this.variants, function(variant){
        return variant.preRender();
    });
    return Promise.all(promises).then(function(){
        return self;
    });
};

/*
 * Get an array of files for a variant
 *
 * @api protected
 */

// Component.prototype.getVariantFiles = function(variantName){

//     var variant = this.getVariant(variantName);
//     var dir = variant.cwd ? this._dir.findDirectory('path', variant.path) : this._entity;
//     var files = [];
//     if (dir && dir.type == 'directory') {
//         files = dir.getFiles();
//     }
//     return files;
// };

/*
 * Gets a de-duped array of the component variants statuses.
 *
 * @api public
 */

Component.prototype.getStatuses = function(){
    return _.compact(_.uniq(_.map(this.variants, function(variant){
        return variant.status;
    })));
};

/*
 * Get the readme contents.
 *
 * @api public
 */

Component.prototype.getReadme = function(){
    var str = null;
    var self = this;
    if (_.isUndefined(this._config.readme)) {
        var readMeFile = _.find(this._files, function(entity){
            return entity.matches(self._app.get('components:readme'));
        });
        str = readMeFile ? readMeFile.getContents() : null;
    } else {
        str = this._config.readme || null;
    }
    return str ? md(str) : null;
};

/*
 * Factory method to create a new component from a directory.
 *
 * @api public
 */

Component.fromDirectory = function(dir, config, app){
    return (new Component(dir, dir.getFiles(), config, app)).init();
};

/*
 * Factory method to create a new component from a file.
 *
 * @api public
 */

Component.fromFile = function(file, dir, config, app){
    // check to see if there is some config associated with the file 
    return {
        toJSON: function(){
            return {
                type: "component",
                handle: file.base
            }
        }
    };
};