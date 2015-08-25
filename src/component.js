var _           = require('lodash');
var minimatch   = require('minimatch');
var Handlebars  = require('handlebars');
var yaml        = require('js-yaml');
var merge       = require('deepmerge');
var swag        = require('swag');

var Directory   = require('./fs/directory');
var File        = require('./fs/file');

module.exports = Component;

function Component(file){
    var self            = this;
    this.path           = file.fauxInfo.urlStylePath;
    this.order          = file.order;
    this.title          = file.title;
    this.id             = file.id;
    this.meta           = file.meta;
    this.from           = file;
    this.type           = 'component';
    this.files          = {};
    this.previewData    = {};

    Object.defineProperty(this, 'template', {
        get: this.getTemplateMarkup
    });

    Object.defineProperty(this, 'rendered', {
        get: this.render
    });

    Object.defineProperty(this, 'jsonData', {
        get: function() {
            return JSON.stringify(self.getPreviewData(), null, 2);
        }
    });

    Object.defineProperty(this, 'jsonMeta', {
        get: function() {
            return JSON.stringify(self.meta, null, 2);
        }
    });

};

Component.fromFile = function(file, config){
    var comp = new Component(file);
    comp.previewData = file.previewData;
    comp.files.markup = file;
    return comp;
};

Component.fromDirectory = function(dir, config){
    var comp = new Component(dir);
    var main = _.find(dir.children, function(child){
        return minimatch(child.fauxInfo.base, getFileMatcher(child.fauxInfo.name, config.matches.markup));
    });
    comp.meta           = main.meta;
    comp.previewData    = main.previewData;
    comp.files.markup   = main;

    var metaDataFile = _.find(dir.children, function(child){
        return minimatch(child.fauxInfo.base, config.matches.metaData);
    });
    if (metaDataFile) {
        var meta = {};
        switch(metaDataFile.fileInfo.ext) {
            case ".js":
                meta = require(metaDataFile.fileInfo.absolute);
                break;
            case ".json":
                meta = JSON.parse(metaDataFile.content);
                break;
            case ".yml":
            case ".yaml":
                meta = yaml.safeLoad(metaDataFile.content);
                break;
        }
        comp.meta = merge(meta, comp.meta);
    }

    comp.title = titleize(comp.meta.title || main.title);

    // var previewDataFile = _.find(dir.children, function(child){
    //     return minimatch(child.fauxInfo.base, getFileMatcher(child.fauxInfo.name, config.matches.previewData));
    // });
    // if (previewDataFile) {
    //     // TODO
    // }
    
    return comp;
};

Component.prototype.render = function(){
    var compiled = Handlebars.compile(this.getTemplateMarkup());
    return compiled(this.getPreviewData());
};

Component.prototype.getPreviewData = function(){
    return this.previewData;
};

Component.prototype.getTemplateMarkup = function(){
    return this.files.markup.content.toString();
};

Component.prototype.isComponent = function(){
    return true;
};

function getFileMatcher(name, match){
    return match.replace('__name__', name);
}

function titleize(str){
    return swag.helpers['titleize'](str);
}