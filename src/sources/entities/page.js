/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var path        = require('path');
var logger      = require('winston');
var matter      = require('gray-matter');

var mixin       = require('./entity');
var utils       = require('../../utils');
var md          = require('../../markdown');

/*
 * Export the page.
 */

module.exports = Page;

/*
 * Group constructor.
 *
 * @api private
 */

function Page(file, dir, config, app){

    var self = this;

    this._app           = app;
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

    this.content        = md(parsed.content);
    this._config        = _.defaultsDeep(this._config, parsed.data || {});
    this.label          = this._config.label || utils.titlize(this._source.name);
    this.title          = this._config.title || this.label;
    this.handle         = this._config.handle || utils.fauxPath(this.isIndex ? this._dir.name : this._source.name);
    this.hidden         = !! (this._config.hidden || this._source.hidden);
    this.fullHandle     = '@' + this.handle;

    return self;
};

/*
 * Factory method to create a new page from a file.
 *
 * @api public
 */

Page.fromFile = function(file, dir, app){
    var self = this;
    // check to see if there is some config associated with the file 
    var configFile = _.find(dir.getFiles(), function(entity){
        return entity.matches(app.get('pages:config'), {
            name: file.name
        });
    });
    var pageConfig = configFile ? data.load(configFile.absolutePath) : Promise.resolve({});
    return pageConfig.then(function(pageConfig){
        return (new Page(file, dir, pageConfig, app)).init();
    });
};