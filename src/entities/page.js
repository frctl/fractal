/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var path        = require('path');
var logger      = require('winston');
var matter      = require('gray-matter');

var mixin       = require('./entity');
var utils       = require('../utils');
var renderer    = require('../handlers/pages');
var app         = require('../application');

/*
 * Export the page.
 */

module.exports = Page;

/*
 * Group constructor.
 *
 * @api private
 */

function Page(file, dir, config){

    var self = this;

    this._source        = file;
    this._dir           = dir;
    this._config        = config;

    this.isIndex        = (file.name === 'index');
    this.type           = 'page';
    this.order          = file.order;
    this.depth          = file.depth;
    this.path           = utils.fauxPath(this.isIndex ? file.relativeDir : path.join(file.relativeDir, file.name));
    this.handlePath     = this.path;

    this.label          = null;
    this.title          = null;
    this.handle         = null;
    this.fullHandle     = null;
    this.hidden         = null;
    this.content        = null;

};

mixin.call(Page.prototype);

/*
 * Initialise the page.
 * Returns a promise.
 *
 * @api private
 */

Page.prototype.init = function(){

    var self = this;
    var parsed = matter(this._source.getContents(), {
        eval: true
    });

    var dirName = this._dir.name

    this._content       = parsed.content;
    this._config        = _.defaultsDeep(this._config, parsed.data || {});
    this.label          = this._config.label || utils.titlize(this._source.name);
    if (this.label.toLowerCase() === 'index') {
        this.label = app.get('pages.indexLabel');
        this.title = this._config.title || utils.titlize(this._source.depth > 1 ? this._dir.name : this.label);
    } else {
        this.title = this._config.title || this.label;
    }

    this.handle         = this._config.handle || utils.fauxPath(this.isIndex ? (this._source.depth > 1 ? this._dir.name : 'home') : this._source.name);
    this.hidden         = !! (this._config.hidden || this._source.hidden);
    this.fullHandle     = '@' + this.handle;
    this.content        = null;

    return self;
};

Page.prototype.renderContent = function(context){
    var self = this;
    return renderer.render(this, context || {}, app).then(function(content){
        self.content = content;
        return content;
    });
};

/*
 * Factory method to create a new page from a file.
 *
 * @api public
 */

Page.fromFile = function(file, dir){
    var self = this;
    // check to see if there is some config associated with the file
    var configFile = _.find(dir.getFiles(), function(entity){
        return entity.matches(app.get('pages.config'), {
            name: file.name
        });
    });
    var pageConfig = configFile ? data.load(configFile.absolutePath) : Promise.resolve({});
    return pageConfig.then(function(pageConfig){

        return (new Page(file, dir, pageConfig, app)).init();
    });
};
