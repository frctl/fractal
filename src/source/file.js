var promise = require("bluebird");
var fs      = promise.promisifyAll(require("fs"));
var path    = require('path');
var matter  = require('gray-matter');
var merge   = require('deepmerge');

var config  = require('../config');

module.exports = File;

function File(rootPath, relDir){
    if (!(this instanceof File)) return new File(rootPath, relDir);
    this.rootPath = rootPath;
    this.relDir = relDir;
    this.stat = {};
};

/**
 * Build a representation of the file from the filesystem,
 * including parsing any frontmatter if it exists.
 */

File.prototype.parse = function(){
    var self = this;
    return fs.statAsync(this.rootPath).then(function(stat){

        self.stat = stat;

        return fs.readFileAsync(self.rootPath).then(function(buffer){

            var parsed = matter(buffer.toString());
            var fileInfo = path.parse(self.rootPath);
            var previewData = parsed.data.preview || {};

            delete parsed.data.preview;

            self.absPath  = path.resolve(self.rootPath);
            self.relPath  = self.rootPath.replace(new RegExp('^(' + self.relDir + '\.)'),"");

            self.content = parsed.content.trim() + "\n";
            self.meta = parsed.data;
            self.data = previewData;
            self = merge(self, fileInfo);
            self.modified = stat.mtime;
            self.dir = self.dir.replace(new RegExp('^(' + self.relDir + '\.)'),"");

            return self;
        });
    });
};