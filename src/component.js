var _           = require('lodash');
var minimatch   = require('minimatch');

var Directory   = require('./fs/directory');
var File        = require('./fs/file');

module.exports = Component;

function Component(file){
    this.path = file.fauxInfo.urlStylePath;
    this.order = file.order;
    this.title = file.title;
    this.id = file.id;
    this.type = 'component';
    this.files = {};
};

Component.fromFile = function(file, config){
    var comp = new Component(file);
    comp.files.markup = file;
    return comp;
};

Component.fromDirectory = function(dir, config){
    var comp = new Component(dir);
    var main = _.find(dir.children, function(child){
        return minimatch(child.fauxInfo.base, getFileMatcher(child.fauxInfo.name, config.matches.markup));
    });
    comp.title     = main.title;
    comp.id        = main.id;
    comp.files.markup = main;

    // var metaDataFile = _.find(dir.children, function(child){
    //     return minimatch(child.fauxInfo.base, getFileMatcher(child.fauxInfo.name, self.config.matches.metaData));
    // });
    // if (metaDataFile) {
    //     // TODO
    // }
    
    return comp;
};

Component.prototype.getTemplateMarkup = function(){
    
    return this.files.markup.content;
};

Component.prototype.isComponent = function(){
    return true;
};

function getFileMatcher(name, match){
    return match.replace('__name__', name);
}