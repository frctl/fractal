/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var logger      = require('winston');

var Directory   = require('../filesystem/directory');
var Component   = require('./entities/component');
var Group       = require('./entities/group');
var mixin       = require('./source');
var data        = require('../data');

/*
 * Export the component source.
 */

module.exports = ComponentSource;

/*
 * ComponentSource constructor.
 *
 * @api private
 */

function ComponentSource(components, app){
    this.components = components;
    this.app = app;
};

mixin.call(ComponentSource.prototype);

/*
 * Resolve a component by handle or path and return the component.
 * If a the handle specified a variant then that will be returned in place of the component.
 *
 * @api public
 */

ComponentSource.prototype.resolve = function(str){
    if (_.startsWith(str, '@')) {
        return this.findByHandle(str);
    } else {
        return this.findByPath(str);
    }
};

/*
 * Find a component by it's path.
 * If a the path specifies a variant then that will be returned in place of the component.
 * Throws an error if the component/variant is not found.
 *
 * Path format: my/component/path:optional-variant-handle
 * 
 * @api public
 */

ComponentSource.prototype.findByPath = function(componentPath){
    var pathParts = componentPath.split('--', 2);
    var component = this.findByKey('path', pathParts[0]);
    return (pathParts.length === 2) ? component.getVariant(pathParts[1]) : component;
};

/*
 * Find a component by it's handle.
 * If a the handle specifies a variant then that will be returned in place of the component.
 * Throws an error if the component/variant is not found.
 *
 * Handle format: @component-handle:optional-variant-handle
 *
 * @api public
 */

ComponentSource.prototype.findByHandle = function(handle){
    handle = handle.replace(/^@/, '');
    var handleParts = handle.split(':', 2);
    var component = this.findByKey('handle', handleParts[0]);
    return (handleParts.length === 2) ? component.getVariant(handleParts[1]) : component;
};

/*
 * Find a component by a key.
 * Throws an error if the component is not found.
 *
 * @api public
 */

ComponentSource.prototype.findByKey = function(key, value) {
    var found = null;
    function checkChildren(children){
        if (found) return found;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.type === 'component' && _.get(child, key) === value) {
                found = child;
                break;
            } else if (child.type == 'group') {
                checkChildren(child.children);
            }
        };
        return found;
    }
    var result = checkChildren(this.components);
    if (!result) {
        throw new Error('The component ' + key + ':' + value + ' could not be found.');
    }
    return result;
};

/*
 * Returns a flattened array of all components in the system
 *
 * @api public
 */

ComponentSource.prototype.flatten = function(){
    function list(items) {
        return _.flatten(_.map(items, function(item){
            return item.type === 'group' ? list(item.children) : item;
        }));
    }
    return new ComponentSource(list(this.components), this.app).init();
};

/*
 * Returns a new component tree filtered by key:value
 *
 * @api public
 */

ComponentSource.prototype.filter = function(key, value){
    function filter(items){
        var ret = [];
        _.each(items, function(item){
            if (item.type === 'component') {
                if (item[key] === value) {
                    ret.push(item);
                }
            } else {
                // group
                var children = filter(item.children);
                if (children.length) {
                    ret.push(new Group(item._dir, item._config, children, item._app));
                }
            }
        }); 
        return _.compact(ret);
    }
    return new ComponentSource(filter(this.components), this.app).init();
};

/*
 * Returns a JSON representation of all the components
 *
 * @api public
 */

ComponentSource.prototype.toJSON = function(){
    return _.map(this.components, function(entity){
        return entity.toJSON();
    });
};

/*
 * Get a JSON-formatted string representation of the components.
 *
 * @api public
 */
    
ComponentSource.prototype.toString = function(){
    return JSON.stringify(this.toJSON(), null, 4);
};

/*
 * Return a new ComponentSource instance from a directory path.
 *
 * @api public
 */

ComponentSource.build = function(app){
    return Directory.fromPath(app.get('components:path')).then(function(dir){
        var defaults = {
            preview: app.get('components:preview:layout'),
            context: app.get('components:context')
        };
        return ComponentSource.buildComponentTree(dir, defaults, app).then(function(tree){
            return new ComponentSource(tree, app).init();    
        });
    });
};

/*
 * Takes a directory and recursively converts it into a tree of components
 *
 * @api public
 */

ComponentSource.buildComponentTree = function(dir, cascadeConfig, app){

    var engine          = app.getComponentViewEngine();
    var ret             = [];
    var files           = dir.getFiles();
    var directories     = dir.getDirectories();

    // see if the directory itself has a config file defined
    var configFile = _.find(files, function(entity){
        return entity.matches(app.get('components:config'), {
            name: dir.name
        });
    });
    
    var dirConfig = configFile ? data.load(configFile.absolutePath) : Promise.resolve({});
    
    return dirConfig.then(function(dirConfig){

        var mergedConfig = _.defaultsDeep(dirConfig, _.pick(cascadeConfig, ['context', 'preview', 'status', 'display']));

        if (dirConfig.type == 'component' || _.find(files, 'base', dir.name + engine.ext)) {
            // Does the config specify this as a component?
            // Or is there a file within this directory that has the same name as the directory?
            // If so it's a component directory.
            try {
                return Component.fromDirectory(dir, mergedConfig, app);
            } catch(e){
                logger.warn('Component could not be created from directory ' + dir.path + ': ' + e.message);
                return null;
            }
        } else {
            // Otherwise check to see if any of the files in the directory match the component filename pattern.
            _.each(files, function(file){
                var matches = file.matches('^(?!.*({{splitter}})).*{{ext}}$', {
                    splitter: app.get('components:variantSplitter'),
                    ext: engine.ext
                });
                if (matches) {
                    ret.push(Component.fromFile(file, dir, mergedConfig, app));
                }
            });
        }

        function makeGroupPromise(directory){
            return ComponentSource.buildComponentTree(directory, mergedConfig, app).then(function(subtree){
                if (_.isArray(subtree)) {
                    return Group.fromDirectory(directory, subtree, app);
                }
                return subtree;
            });
        }

        // And then finally recurse through any directories.
        for (var i = directories.length - 1; i >= 0; i--) {
            var directory = directories[i];
            if (directory.hasChildren()) {
                ret.push(makeGroupPromise(directory));
            }
        }

        return Promise.all(ret).then(function(items){
            var items = _.compact(items);
            return _.isArray(items) ? _.sortByOrder(items, ['order','label'], ['asc','asc']) : items;    
            // return _.isArray(items) ? _.sortByOrder(items, ['type','order','label'], ['desc','asc','asc']) : items;    
        });
        
    });
};