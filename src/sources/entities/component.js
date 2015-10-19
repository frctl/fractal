/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');

var mixin       = require('./entity');
var collector   = require('../../filesystem/collector');
var utils       = require('../../utils');
var dataParser  = require('../../data');

/*
 * Export the component.
 */

module.exports = Component;

/*
 * Group constructor.
 *
 * @api private
 */

function Component(files, data, meta){
    var self = this;
    this.type = 'component';
    this.files = files;
    this.data = data;
    _.defaults(this, meta);
    console.log(this.title);
};

mixin.call(Component.prototype);

/*
 * Create a new component from a directory.
 *
 * - Collect files according to type.
 * - Parse any YAML front matter from preview file.
 * - Merge FM data with data from data file, if present.
 * - Instantiate and return new component.
 * 
 * @api public
 */

Component.createFromDirectory = function(dir, config){
    var preview = config.files['preview'] || null;
    if (!preview) {
        throw new Error('No preview file definition found');
    }

    var files = collector.collectFiles(dir.children, _.clone(config.files), {
        name: dir.name
    }, true);

    if (!files.preview.matched) {
        throw new Error('No preview file found');
    }

    var previewFile = files.preview.matched;
    var parsed = utils.parseFrontMatter(previewFile.contents);
    var data = files['data'].matched ? dataParser.fromFile(files['data'].matched, parsed.data) : {};

    var meta = {
        origin: 'directory',
        title:  data.title || utils.titlize(dir.name),
        order:  dir.order,
        hidden: data.hidden || previewFile.hidden,  
    };

    previewFile.replaceContents(parsed.body);

    return new Component(files, data, meta).init();
};