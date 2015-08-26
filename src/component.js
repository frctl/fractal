var _           = require('lodash');
var minimatch   = require('minimatch');
var Handlebars  = require('handlebars');
var merge       = require('deepmerge');
var swag        = require('swag');
var beautifyJS  = require('js-beautify').js;
var beautifyCSS = require('js-beautify').css;
var beautifyHTML = require('js-beautify').html;

var Directory   = require('./fs/directory');
var File        = require('./fs/file');
var data        = require('./data');
var config      = require('./config');

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
    this.previewData    = file.previewData || {};
    this.layout         = null;
};

Component.fromFile = function(file, componentDirectory){
    var comp = new Component(file);
    comp.files.markup = file;
    comp.layout = getLayout(comp, componentDirectory);
    return comp;
};

Component.fromDirectory = function(dir, componentDirectory){
    var comp            = new Component(dir);
    var main            = findRelated(dir, dir.children, 'markup');
    var meta            = data.fetchFromFile(findRelated(main, dir.children, 'metaData'));
    var previewData     = data.fetchFromFile(findRelated(main, dir.children, 'previewData'));
    
    comp.meta           = merge(meta || {}, main.meta);
    comp.previewData    = merge(previewData || {}, main.previewData);
    
    comp.id             = comp.meta.id || main.id;
    comp.title          = titleize(comp.meta.title || main.title);
    comp.files.markup   = main;
    
    comp.layout = getLayout(comp, componentDirectory);

    return comp;
};

Component.prototype.render = function(dataKey, withoutLayout){
    var compiled = Handlebars.compile(this.getTemplateMarkup());
    var output = beautifyHTML(compiled(this.getPreviewData(dataKey)), {
        "preserve_newlines": false,
        "indent_size": 4
    });
    if (!withoutLayout && this.layout) {
        var layout = Handlebars.compile(this.getLayoutMarkup());
        output = layout({
            "content": output
        });
    }
    return output;
};

Component.prototype.getMetaData = function(){
    return merge(this.meta, {
        id: this.id,
        title: this.title
    });
};

Component.prototype.getPreviewData = function(key){
    key = key || 'default';
    var data = _.get(this.previewData, key, null);
    if (!data && key === 'default') {
        return this.previewData;
    } else if (!data) {
        return this.getPreviewData();
    }
    return data;
};

Component.prototype.getVariants = function(){
    if (!_.isUndefined(this.previewData.default)){
        return _.keys(this.previewData);
    }
    return null;
};

Component.prototype.getTemplateMarkup = function(){
    return this.files.markup.content.toString();
};

Component.prototype.getLayoutMarkup = function(){
    if (!this.layout) {
        return '{{{content}}}';
    }
    if (_.isString(this.layout)) {
        return this.layout;
    }
    return this.layout.content.toString();
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

function findRelated(file, files, matches) {
    var name = _.get(file, 'name');
    return _.find(files, function(f){
        return minimatch(f.fauxInfo.base, getFileMatcher(name, config.get('source.components.matches.' + matches)));
    })
}

function getLayout(component, componentDirectory){
    var layout = null;
    if (component.meta.layout) {
        layout = componentDirectory.tryFindFile(component.meta.layout);
    } else if (config.get('source.components.layout')) {
        layout = componentDirectory.tryFindFile(config.get('source.components.layout'));
    }
    return layout;
}