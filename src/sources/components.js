var _           = require('lodash');
var minimatch   = require('minimatch');

var Directory   = require('../fs/directory');
var mixin       = require('./mixin');

module.exports = Components;

function Components(config, dir){
    this.config = config;
    this.directory = dir;
    this.components = null;
};

mixin.call(Components.prototype);

Components.prototype.init = function(){
    var self = this;
};

Components.prototype.getComponents = function(){
    if (!this.components) {
        var self = this;
        var getComponents = function(dir){
            var components = [];
            dir.children.forEach(function(item){
                if (item.isFile()) {
                    if (item.matches('fauxInfo.base', self.config.matches.markup)) {
                        // it's a component
                        components.push(makeComponent(item, _.filter(dir.children, 'type', 'file')));
                    }
                } else if (item.isDirectory() && item.hasChildren()) {
                    var childComponent = item.findFile('fauxInfo.base', getFileMatcher(item.fauxInfo.name, self.config.matches.markup));
                    if (childComponent) {
                        // it's a component
                        components.push(makeComponent(item, _.filter(item.children, 'type', 'file')));
                    } else {
                        components.push({
                            title: item.title,
                            type: 'directory',
                            children: getComponents(item)
                        });
                    }
                }
            });
            return components;
        };
        this.components = getComponents(this.directory);
    }
    return this.components;
};

function getFileMatcher(name, match){
    return match.replace('__name__', name);
}

function makeComponent(file, related){
    return {
        title: file.title,
        type: 'component',
        related: related.length
    };
}

    // function filter(dir){
    //     var filtered = [];
    //     dir.children.forEach(function(item){
    //         if (item.isFile()) {
    //             filtered.push(item);
    //         } else if (item.isDirectory() && item.hasChildren()) {
    //             filtered.push(Directory.removeEmptyDirectories(item));
    //         }
    //     });
    //     dir.children = filtered;
    // }
    // filter(directory);
    // return directory;