var _           = require('lodash');
var minimatch   = require('minimatch');

var Directory   = require('../fs/directory');
var File        = require('../fs/file');
var Component   = require('../component');
var config      = require('../config');

module.exports = Components;

function Components(components, config){
    this.config = config;
    this.components = components;
    this.finderCache = [];
};

// mixin.call(Components.prototype);

Components.fromDirectory = function(directory, config){
    return directory.then(function(dir){
        return new Components(getComponents(dir), config);
    });
};


Components.prototype.findComponent = function(key, value) {
    var found = null;
    function checkChildren(children){
        if (found) return found;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.type === 'component' && (_.get(child, key) === value || minimatch(_.get(child, key, ''), value))) {
                found = child;
                break;
            } else if (child.type == 'directory') {
                checkChildren(child.children);
            }
        };
        return found;
    }
    return checkChildren(this.components);
};

Components.prototype.tryFindComponent = function(value){
    var guesses = ['id', 'path'];
    for (var i = 0; i < guesses.length; i++) {
        var check = this.findComponent(guesses[i], value);
        if (check) {
            return check;
        }
    };
    return null;
};

Components.prototype.getComponents = function(includeHidden){
    if (!includeHidden) {
        return this.filterComponents(function(item){
            return item.hidden === false;
        });
    }
    return this.components;
};

Components.prototype.each = function(callback, filter){
    filter = filter || 'all';
    function doForEach(components){
        _.each(components, function(item){
            if (filter === 'all') {
                callback(item);
            } else {
                if (filter === 'component' && item.type === 'component') {
                    callback(item);
                } else if (item.type === 'directory') {
                    if (filter === 'directory') {
                        callback(item);    
                    }
                }
            }
            if (item.type === 'directory') {
                doForEach(item.children, callback);
            }
        });
    }
    return doForEach(this.components);
};

Components.prototype.toJSON = function(){
    var self = _.clone(this);
    delete self['finderCache'];
    return self;
};

Components.prototype.filterComponents = function(callback){
    function filter(items, callback){
        var filtered = [];
        items.forEach(function(item){
            if (item.type === 'component' && callback(item)) {
                filtered.push(item);
            } else if (item.type === 'directory') {
                item.children = filter(item.children, callback);
                if (item.children.length){
                    filtered.push(item);
                }
            }
        });
        return filtered;
    }
    return filter(this.components, callback);
};

function getComponents(dir){
    var ret = [];
    var directories = _.filter(dir.children, 'type', 'directory');
    var files = _.filter(dir.children, 'type', 'file');
    var markupFiles = _.filter(files, function(file){
        return file.matches('fauxInfo.base', config.get('source.components.matches.markup'));
    });

    for (var i = markupFiles.length - 1; i >= 0; i--) {
        var file = markupFiles[i];
        if (!dir.isRoot) {
            if (file.fauxInfo.name === dir.fauxInfo.name) {
                // matches parent directory name so this whole directory is a component
                return Component.fromDirectory(dir);
            }
        }
        ret.push(Component.fromFile(file));
    };

    for (var i = directories.length - 1; i >= 0; i--) {
        var directory = directories[i];
        if ( directory.hasChildren()) {
            var children = getComponents(directory);
            if (!_.isArray(children)) {
                ret.push(children);
            } else {
                ret.push({
                    name: directory.fauxInfo.name,
                    title: directory.title,
                    order: directory.order,
                    id: directory.id,
                    isDirectory: true,
                    type: 'directory',
                    children: children
                });
            }
        }
    };

    return _.isArray(ret) ? _.sortByOrder(ret, ['type','order','title'], ['desc','asc','asc']) : ret;
};