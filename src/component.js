var promise     = require("bluebird");
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
var fractal     = require('../fractal');

module.exports = Component;

function Component(file){
    var self            = this;
    this.path           = file.fauxInfo.urlStylePath;
    this.order          = file.order;
    this.title          = file.title;
    this.id             = file.id;
    this.meta           = file.meta;
    this.type           = 'component';
    this.files          = {};
    this.previewData    = file.previewData || {};
    this.layout         = null;
};

Component.fromFile = function(file){
    var comp = new Component(file);
    comp.files.markup = file;
    comp.hidden = file.hidden;
    return comp;
};

Component.fromDirectory = function(dir){
    var comp            = new Component(dir);
    var main            = findRelated(dir, dir.children, 'markup');
    var meta            = data.fetchFromFile(findRelated(main, dir.children, 'metaData'));
    var previewData     = data.fetchFromFile(findRelated(main, dir.children, 'previewData'));
    
    comp.meta           = merge(meta || {}, main.meta);
    comp.previewData    = merge(previewData || {}, main.previewData);
    
    comp.id             = comp.meta.id || main.id;
    comp.title          = titleize(comp.meta.title || main.title);
    comp.hidden         = main.hidden;
    comp.files.markup   = main;
    comp.files.styles   = findAllRelated(main, dir.children, 'styles');

    return comp;
};

Component.prototype.render = function(dataKey, withoutLayout){
    var self            = this;
    var templateMarkup  = this.getTemplateMarkup();
    var layoutMarkup    = withoutLayout ? null : this.getLayoutMarkup();
    return promise.join(templateMarkup, layoutMarkup, function(tpl, layout){
        var compiled = Handlebars.compile(tpl);
        var output = beautifyHTML(compiled(self.getPreviewData(dataKey)), {
            "preserve_newlines": false,
            "indent_size": 4
        });
        if (layout) {
            var layout = Handlebars.compile(layout);
            output = layout({
                "content": output
            });
        }
        return output;
    });
};

Component.prototype.getMetaData = function(){
    return merge(this.meta, {
        id: this.id,
        title: this.title
    });
};

Component.prototype.getStyles = function(){
    var styleFiles = _.get(this, 'files.styles');
    if (styleFiles) {
        if (styleFiles.length === 1) {
            return styleFiles[0].content.toString();
        } else {
            return styleFiles.map(function(file){
                return "/* " + file.fauxInfo.base + " *\/\n\n" + file.content.toString() + "\n\n";
            }).join("\n")
        }
    }
    return null;
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
    return promise.resolve(this.files.markup.content.toString());
};

Component.prototype.getLayoutMarkup = function(){
    return this.getLayout().then(function(layout){
        if (!layout) {
            return '{{{content}}}';
        }
        if (_.isString(layout)) {
            return layout;
        }
        return layout.files.markup.content.toString();
    });
};

Component.prototype.isComponent = function(){
    return true;
};

Component.prototype.getLayout = function(){
    var self = this;
    if (!this.layout) {
        this.layout = fractal.getSources().then(function(sources){
            var layout = null;
            var checkLayout = self.meta.layout || config.get('source.components.layout');
            if (checkLayout && checkLayout !== self.id && checkLayout !== self.path ) {
                layout = sources.components.tryFindComponent(checkLayout);
            }
            return layout;
        });
    }
    return this.layout;
};

function getFileMatcher(name, match){
    return match.replace('__name__', name);
}

function titleize(str){
    return swag.helpers['titleize'](str);
}

function findRelated(file, files, matches, multiple) {
    var name = _.get(file, 'name');
    var results = _.filter(files, function(f){
        return minimatch(f.fauxInfo.base, getFileMatcher(name, config.get('source.components.matches.' + matches)));
    });
    if (results.length) {
        if (multiple) {
            return results;
        } else {
            return _.first(results);
        }
    }
    return null;
}

function findAllRelated(file, files, matches) {
    return findRelated(file, files, matches, true);
}