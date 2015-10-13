var promise     = require("bluebird");
var _           = require('lodash');
var minimatch   = require('minimatch');
var Handlebars  = require('handlebars');
var merge       = require('deepmerge');
var swag        = require('swag');
var cheerio     = require('cheerio');

var Directory   = require('./fs/directory');
var File        = require('./fs/file');
var DataFetcher = require('./data');
var conf        = require('./config');
var output      = require('./output');
var fractal     = require('../fractal');
var status      = require('./status');
var vc          = require('./vc');

module.exports = Component;

function Component(config){
    this.id             = config.id;
    this.path           = config.path;
    this.pathWithExt    = config.pathWithExt;
    this.fsPath         = config.fsPath;
    this.fullFsPath     = config.fullFsPath;
    this.title          = config.title;
    this.origin         = config.origin;
    this.hidden         = config.hidden;
    this.depth          = config.depth;
    this.status         = config.status || status.getDefault();
    this.order          = config.order || 0;
    this.data           = config.data || {};
    this.type           = 'component';
    this.files          = config.files || {};
    this.layoutComponent = null;
    this.variants       = null;
};

Component.fromFile = function(file){
    try {
        return new Component({
            id:     file.getId(),
            origin:   'file',
            title:  file.getTitle(),
            path:   file.fauxInfo.urlStylePath,
            pathWithExt: file.fauxInfo.relative,
            fsPath: file.fileInfo.relative.replace(/\.(hbs|handlebars)$/,''),
            fullFsPath: file.fileInfo.relative,
            order:  file.order,
            depth:  file.depth,
            hidden: file.isHidden(),
            data:   file.data,
            status: status.findStatus(file.data.status),
            files: {
                markup: file
            }
        });
    } catch(e) {
        console.log('[FRACTAL] Error loading component at ' + file.relPath + ': ' + e.message);
        return null;
    }
};

Component.fromDirectory = function(dir){
    try {
        var main            = findRelated(dir, dir.children, 'markup');
        var data            = merge(main.data, DataFetcher.fetchFromFile(findRelated(main, dir.children, 'data')) || {});    
        return new Component({
            id:     data.id || main.getId(),
            origin:   'directory',
            title:  data.title || main.getTitle(),
            depth:  dir.depth,
            path:   dir.fauxInfo.urlStylePath,
            pathWithExt: dir.fauxInfo.urlStylePath,
            fsPath: main.fileInfo.relative.replace(/\.(hbs|handlebars)$/,''),
            fullFsPath: main.fileInfo.relative,
            order:  dir.order,
            hidden: data.hidden || main.isHidden(),
            status: status.findStatus(data.status),
            data:   data,
            files: {
                markup:     main,
                readme:     findRelated(main, dir.children, 'readme'),
                styles:     findAllRelated(main, dir.children, 'styles'),
                behaviour:  findAllRelatedBehaviourFiles(main, dir.children),
            }
        });
    } catch(e) {
        console.log('[FRACTAL] Error loading component at ' + dir.relPath + ': ' + e.message);
        return null;
    }
};

Component.prototype.render = function(variant, withoutLayout){
    var content = output.renderComponent(this, variant);
    if (!withoutLayout) {
        content = output.wrapWithLayout(content, this.getLayoutMarkup());
    }
    return content;
};

Component.prototype.renderAll = function(withoutLayout){
    var content = output.renderComponent(this, _.pluck(this.getVariants(), 'name'));
    if (!withoutLayout) {
        content = output.wrapWithLayout(content, this.getLayoutMarkup());
    }
    return content;
};

Component.prototype.getData = function(){
    return merge(this.data, {
        id:     this.id,
        title:  this.title,
        hidden: this.hidden,
        status: this.status
    });
};

Component.prototype.getNotes = function(){
    var readmeFile = _.get(this, 'files.readme');
    if (readmeFile) {
        var $ = cheerio.load(readmeFile.content.toString());
        $('h1').remove();
        return $.html();
    }
    return null;
};

Component.prototype.getDisplayStyle = function(){
    return _.get(this.data, 'display', conf.get('components.display'));
};

Component.prototype.getStyles = function(){
    return getContentFromFiles(_.get(this, 'files.styles'));
};

Component.prototype.getBehaviour = function(){
    return getContentFromFiles(_.get(this, 'files.behaviour'));
};

Component.prototype.getAllTemplateContexts = function(){
    var self = this;
    return _.map(this.getVariants(), function(variant){
        return self.getTemplateContext(variant.name);
    });
};

Component.prototype.getTemplateContext = function(variant){
    var variants = this.getVariants();
    if (variant) {
        var data = _.find(variants, 'name', variant) || variants[0];
    } else {
        data = this.getData();
    }
    return data.context || null;
};

Component.prototype.getVariant = function(key){
    if (!key) return null;
    return _.find(this.getVariants(), 'name', key) || null;
};

Component.prototype.getVariants = function(){
    if (this.variants === null) {
        var base = _.clone(this.getData());
        var variants = this.data.variants || {};
        delete base.variants;
        base.name   = 'base';
        base.title  = 'Base';
        variants    = _.map(variants, function(variant, key){
            if (!variant.hidden) {
                variant.name = key;
                variant.title = variant.title || titleize(variant.name);
                variant.id = base.id + '--' + key;
                variant.preview = merge(base.preview || {}, variant.preview || {});
                variant.status = variant.status ? status.findStatus(variant.status) : base.status;
                return variant;
            }
        });
        if (!_.find(variants, 'name', 'base')) {
            variants.unshift(base);    
        }
        this.variants = variants;
    }
    return this.variants;
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

Component.prototype.getHistory = function(){
    // Get combined history of all related files
    if (!vc.hasVC()) {
        return promise.resolve(null);
    }
    if (!this.history) {
        var self = this;
        var histories = {};
        var relatedFiles = {};
        _.each(this.files, function(fileSet, type){
            if (!fileSet) return;
            if ( !_.isArray(fileSet)) {
                fileSet = [fileSet];
            }
            _.each(fileSet, function(file){
                relatedFiles[file.uuid] = {
                    type: type,
                    file: file
                };
                histories[file.uuid] = file.getHistory();    
            });
        });
        this.history = promise.props(histories).then(function(histories){
            var mergedHistories = [];
            _.each(histories, function(hist, key){
                var relatedFile = relatedFiles[key];
                var fileInfo = {
                    type: relatedFile.type,
                    name: relatedFile.file.fileInfo.base
                };
                _.each(hist, function(commit){
                    var existing = _.find(mergedHistories, 'sha', commit.sha);
                    if (existing) {
                        existing.files.push(fileInfo);
                        existing.files = _.sortBy(existing.files, 'name');
                    } else {
                        commit.files = [fileInfo];
                        mergedHistories.push(commit);
                    }
                });
            });
            return _.sortByOrder(mergedHistories, ['date'], ['desc']);
        });
    }
    return this.history;
};

Component.prototype.getLayout = function(){
    var self = this;
    if (!this.layoutComponent) {
        this.layoutComponent = fractal.getSources().then(function(sources){
            var layout = null;
            var checkLayout = self.data.layout || conf.get('components.layout');
            if (checkLayout && checkLayout !== self.id && checkLayout !== self.path ) {
                layout = sources.components.tryFindComponent(checkLayout);
            }
            return layout;
        });
    }
    return this.layoutComponent;
};

Component.prototype.getStaticSelf = function(){

    var self = this;
    var variants = this.getVariants();
    var mergedContexts = this.getAllTemplateContexts();
    
    // Promises
    var toResolve = {};
    toResolve.history = this.getHistory();
    toResolve.template = this.getTemplateMarkup();

    var rendered = {};
    var contexts = {
        _merged: {
            raw: mergedContexts,
            highlighted: output.highlight(mergedContexts, 'json')
        }
    };
    _.each(variants, function(variant){
        var raw = self.render(variant.name, true);
        var wrapped = self.render(variant.name, false);
        var context = self.getTemplateContext(variant.name);
        rendered[variant.name] = promise.join(raw, wrapped, function(r, w){
            return {
                raw: r,
                wrapped: w,
                highlighted: output.highlight(r, 'html')
            }
        });
        contexts[variant.name] = {
            raw: context,
            highlighted: output.highlight(context, 'json'),
        }
    });

    var mergedRaw = this.renderAll(true);
    var mergedWrapped = this.renderAll(false);
    rendered._merged = promise.join(mergedRaw, mergedWrapped, function(r, w){
        return {
            raw: r,
            wrapped: w,
            highlighted: output.highlight(r, 'html')
        }
    });

    toResolve.rendered = promise.props(rendered);

    var files = _.compact(_.flatten(_.map(this.files, function(files){
        if (files) {
            if (_.isArray(files)) {
                return files
            }
            return [files];    
        }
    })));

    return promise.props(toResolve).then(function(props){

        var behaviourContent = self.getBehaviour();
        var stylesContent = self.getStyles();

        var ret = {
            title:              self.title,
            id:                 self.id,
            origin:             self.origin,
            status:             self.status,
            path:               self.path,
            pathWithExt:        self.pathWithExt,
            fsPath:             self.fsPath,
            fullFsPath:         self.fullFsPath,
            data:               self.getData(),
            variants:           variants,
            variantsCount:      variants.length,
            rendered:           props.rendered,
            files:              files,
            template: {
                raw:            props.template,
                highlighted:    output.highlight(props.template, 'hbs'),
            },
            behaviour: behaviourContent ? {
                raw: behaviourContent,
                highlighted: output.highlight(behaviourContent, 'js'),
            } : null,
            styles: stylesContent ? {
                raw: stylesContent,
                highlighted: output.highlight(stylesContent, 'scss'),
            } : null,
            contexts: contexts,
            notes: self.getNotes(),
            history: props.history,
        };  

        return ret;

    });
};

function getContentFromFiles(files){
    if (files) {
        if (files.length === 1) {
            var content = files[0].content.toString();
        } else {
            var content = files.map(function(file){
                return "/* " + file.fauxInfo.base + " *\/\n\n" + file.content.toString() + "\n\n";
            }).join("\n")
        }
        return content;
    }
    return null;
}

function getFileMatcher(name, match){
    return match.replace('__name__', name);
}

function findRelated(file, files, matches, multiple) {
    var name = _.get(file, 'name');
    var results = _.filter(files, function(f){
        return minimatch(f.fauxInfo.base, getFileMatcher(name, conf.get('components.matches.' + matches)));
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

function titleize(str){
    return swag.helpers['titleize'](str);
}

function findAllRelatedBehaviourFiles(file, files){
    var name = _.get(file, 'name');
    var related = findAllRelated(file, files, 'behaviour');
    // filter out data files
    return _.filter(related, function(f){
        return ! minimatch(f.fauxInfo.base, getFileMatcher(name, conf.get('components.matches.data')));
    });
}