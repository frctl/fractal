var _           = require('lodash');
var minimatch   = require('minimatch');

var Directory   = require('../fs/directory');
var File        = require('../fs/file');
var Component   = require('../component');
var mixin       = require('./mixin');

module.exports = Components;

function Components(config, dir){
    this.config = config;
    this.directory = dir;
    this.components = null;
    this.finderCache = [];
};

mixin.call(Components.prototype);

Components.prototype.init = function(){
    var self = this;
};

Components.prototype.findComponent = function(key, value) {
    var found = null;
    function checkChildren(children){
        if (found) return found;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.type === 'component' && (_.get(child, key) === value || minimatch(_.get(child, key), value))) {
                found = child;
                break;
            } else if (child.type == 'directory') {
                checkChildren(child.children);
            }
        };
        return found;
    }
    return checkChildren(this.getComponents());
};

Components.prototype.getComponents = function(){
    if (!this.components) {

        var self = this;

        function getComponents(dir){
            var ret = [];
            var directories = _.filter(dir.children, 'type', 'directory');
            var files = _.filter(dir.children, 'type', 'file');
            var markupFiles = _.filter(files, function(file){
                return file.matches('fauxInfo.base', self.config.matches.markup);
            });

            for (var i = markupFiles.length - 1; i >= 0; i--) {
                var file = markupFiles[i];
                if (!dir.isRoot) {
                    if (file.fauxInfo.name === dir.fauxInfo.name) {
                        // matches parent directory name so this whole directory is a component
                        return Component.fromDirectory(dir, self.config);
                    }
                }
                ret.push(Component.fromFile(file, self.config));
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

            return ret;
        };
        this.components = getComponents(this.directory);
    }
    return this.components;
};

Components.prototype.toJSON = function(){
    var self = _.clone(this);
    delete self['finderCache'];
    return self;
};