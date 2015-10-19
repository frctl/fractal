/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var path        = require('path');
var fs          = Promise.promisifyAll(require('fs'));

var mixin       = require('./entity');

/*
 * Export the File.
 */

module.exports = File;

/*
 * File constructor.
 *
 * @api private
 */

function File(filePath, contents, meta){
    this.type = 'file';
    this.absolutePath = filePath;
    this.contents = contents;
    this.stat = meta.stat;
    this.path = meta.relativePath;
};

mixin.call(File.prototype);

/*
 * Override the contents of a file. Not saved to disk.
 *
 * @api public
 */

File.prototype.replaceContents = function(contents){
    this.contents = contents;
    return this;
};

/*
 * Return a new File instance from a path.
 *
 * @api public
 */

File.fromPath = function(filePath, relativeTo){
    filePath = path.resolve(filePath);
    var stat = fs.statAsync(filePath);    
    var contents = fs.readFileAsync(filePath);
    return Promise.join(stat, contents, function(stat, contents) {
        return new File(filePath, contents, {
            stat: stat,
            relativePath: path.relative(relativeTo, filePath),
        }).init();
    });
};
