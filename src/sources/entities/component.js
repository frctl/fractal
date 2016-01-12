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
var app         = require('../../application');

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

function Component(entity, files, config){

    var self                = this;
    var engine              = app.get('components:engine');

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
    this.path               = utils.fauxPath(this.sourceType == 'directory' ? entity.path : path.join(entity.relativeDir, entity.name));
    this.handlePath         = this.path;
    this.handle             = config.handle || utils.fauxPath(entity.name);
    this.fullHandle         = '@' + this.handle;
    this.label              = config.label || utils.titlize(entity.name);
    this.title              = config.title || this.label;
    this.defaultHandle      = config.default || 'default';
    this.viewExt            = engine.ext;
    this.engine             = engine.engine;
    this.hasMultipleVariants = false;

    if (this.sourceType == 'directory') {
        var variantViewBase = entity.name;
    } else {
        var variantViewBase = entity.fsName;
    }

    this.variantDefaults = {
        status:     config.status || app.get('statuses:default'),
        context:    config.context || {},
        preview:    config.preview || app.get('components:preview:layout'),
        display:    config.display || {},
        view:       config.view || (variantViewBase + this.viewExt)
    };

    this._viewFiles = _.filter(files, function(file){
        return file.matches('^.*{{ext}}$', {
            ext: engine.ext
        });
    });

    this._configFiles = _.filter(files, function(file){
        return file.matches(app.get('components:config'), {
            name: '.*'
        }, null, true);
    });

    this._readMeFiles = _.filter(files, function(file){
        return file.matches(app.get('components:readme'));
    });

    this._nonViewFiles = _.difference(files, this._viewFiles);

    this._nonCoreFiles = _.difference(files, this._viewFiles, this._configFiles, this._readMeFiles);

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
        self.hasMultipleVariants = self.variants.length > 1;
        return self;
    });
};

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
    var splitter = app.get('components:variantSplitter');
    var configs = _.map(this._config.variants || [], function(config){
        if (!_.isUndefined(config.handle)) {
            return makeVariantConfig(config.handle, config).then(function(conf){
                conf.files = _.clone(self._nonCoreFiles);
                // get the view file
                var file = _.find(self._viewFiles, 'fsBase', conf.view);
                if (!file) {
                    logger.error('Variant of ' + config.handle + ' could not be created - view file not found');
                    return null;
                }
                conf.files.unshift(file);
                return conf;
            });
        } else {
            logger.error('Variant of ' + config.handle + ' could not be created: ' + e.message );
        }
    });

    return Promise.all(configs).then(function(configs){

        // Generate configs for any files that look like a variant but don't have config specified.
        _.each(self._viewFiles, function(file){
            if (file.fsBase == self.variantDefaults.view) {
                // it's the default variant's view
                if (!_.find(configs, 'handle', self.defaultHandle)) {
                    var variantConf = makeVariantConfig(self.defaultHandle, {
                        handle: self.defaultHandle
                    }).then(function(conf){
                        conf.files = _.clone(self._nonCoreFiles);
                        conf.files.unshift(file);
                        return conf;
                    });
                    configs.push(variantConf);
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
                        var variantConf = makeVariantConfig(parts[1], {
                            handle: parts[1],
                            view: file.base
                        }).then(function(conf){
                            conf.files = _.clone(self._nonCoreFiles);
                            conf.files.unshift(file);
                            return conf;
                        });
                        configs.push(variantConf);
                    }
                }
            }
        });

        // if (this.sourceType == 'directory') {
        //     // also check the subdirectories to see if any of those contain variants
        //     var subDirs = this._source.getDirectories();

        // }

        return Promise.all(configs).then(function(configs){
            // Now generate some variant objects from the configs
            return _.map(configs, function(config){
                return (new Variant(config.handle, config, self)).init();
            }).sort(function(a, b){
                if (a.handle === self.defaultHandle) {
                    return -1;
                }
                if (b.handle === self.defaultHandle) {
                    return 1;
                }
                return 0;
            });
        });
    });

    function makeVariantConfig(handle, variantConf){
        // is there a variant-specific config file?
        var configFile = _.find(self._configFiles, function(entity){
            return entity.matches(app.get('components:config'), {
                name: self.handle + splitter + handle
            });
        });
        var specificConfig = configFile ? data.load(configFile.absolutePath) : Promise.resolve({});
        return specificConfig.then(function(spec){
            return _.defaultsDeep(spec, variantConf, self.variantDefaults);
        });
    }

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
            return entity.matches(app.get('components:readme'));
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

Component.fromDirectory = function(dir, config){
    return (new Component(dir, dir.getFiles(), config)).init();
};

/*
 * Factory method to create a new component from a file.
 *
 * @api public
 */

Component.fromFile = function(file, dir, config){
    var self = this;
    var files = _.filter(dir.getFiles(), function(file){
        return _.startsWith(file.name, file.name);
    });

    // check to see if there is some config associated with the file
    var configFile = _.find(files, function(entity){
        return entity.matches(app.get('components:config'), {
            name: file.name
        });
    });
    var componentConfig = configFile ? data.load(configFile.absolutePath) : Promise.resolve({});
    return componentConfig.then(function(componentConfig){
        return (new Component(file, files, _.defaultsDeep(componentConfig, config))).init();
    });
};
