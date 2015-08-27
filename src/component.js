var promise     = require("bluebird");
var _           = require('lodash');
var minimatch   = require('minimatch');
var Handlebars  = require('handlebars');
var merge       = require('deepmerge');
var swag        = require('swag');
var cheerio     = require('cheerio');
var Highlights  = require('highlights');
var beautifyJS  = require('js-beautify').js;
var beautifyCSS = require('js-beautify').css;
var beautifyHTML = require('js-beautify').html;

var Directory   = require('./fs/directory');
var File        = require('./fs/file');
var data        = require('./data');
var config      = require('./config');
var renderer    = require('./renderer');
var fractal     = require('../fractal');

var highlighter = new Highlights();
highlighter.requireGrammarsSync({
    modulePath: require.resolve('atom-handlebars/package.json')
});

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
    comp.files.readme   = findRelated(main, dir.children, 'readme');
    comp.files.styles   = findAllRelated(main, dir.children, 'styles');

    return comp;
};

Component.prototype.render = function(variant, withoutLayout, highlight){
    return renderer.render(this, variant, withoutLayout).then(function(html){
        return highlight ? highlighter.highlightSync({
            fileContents: html,
            scopeName: 'text.html.basic'
        }) : html;
    });
};

Component.prototype.getMetaData = function(highlight){
    var meta = merge(this.meta, {
        id: this.id,
        title: this.title
    });
    return highlight ? highlightObj(meta) : meta;
};

Component.prototype.getNotes = function(){
    var readmeFile = _.get(this, 'files.readme');
    if (readmeFile) {
        console.log(cheerio);
        var $ = cheerio.load(readmeFile.content.toString());
        $('h1').remove();
        return $.html();
    }
    return null;
};

Component.prototype.getStyles = function(highlight){
    var styleFiles = _.get(this, 'files.styles');
    if (styleFiles) {
        if (styleFiles.length === 1) {
            var content = styleFiles[0].content.toString();
        } else {
            var content = styleFiles.map(function(file){
                return "/* " + file.fauxInfo.base + " *\/\n\n" + file.content.toString() + "\n\n";
            }).join("\n")
        }
        return highlight ? highlighter.highlightSync({
            fileContents: content,
            scopeName: 'source.css.scss'
        }) : content;
    }
    return null;
};

Component.prototype.getPreviewData = function(key, highlight){
    key = key || 'default';
    var data = _.get(this.previewData, key, null);
    if (!data && key === 'default') {
        data = this.previewData;
    } else if (!data) {
        data = this.getPreviewData();
    }
    return highlight ? highlightObj(data) : data;
};

Component.prototype.getVariants = function(){
    if (!_.isUndefined(this.previewData.default)){
        return _.keys(this.previewData);
    }
    return null;
};

Component.prototype.getTemplateMarkup = function(highlight){
    return promise.resolve(this.files.markup.content.toString()).then(function(html){
        return highlight ? highlighter.highlightSync({
            fileContents: html,
            scopeName: 'text.html.handlebars'
        }) : html;
    });
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

function highlightObj(obj) {
    return highlighter.highlightSync({fileContents: JSON.stringify(obj, null, 4), scopeName: 'source.json'});
}