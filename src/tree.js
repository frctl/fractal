var path = require('path');
var promise = require("bluebird");
var fs = promise.promisifyAll(require("fs"));
var _ = require('lodash');
var matter = require('gray-matter');
var absolute = require('absolute');
var merge = require('deepmerge');

module.exports = Tree;

function Tree(config){
    if (!(this instanceof Tree)) return new Tree(config);
    this.config = config;
    this.tree = null;
};

Tree.prototype.build = function(){
    this.tree = this.readDir(this.config.dir);
    this.tree.then(function(item){
        console.log(item);
    });
};

Tree.prototype.refresh = function(){
    // TODO: add tree refresh functionality
};

/**
 * Read all the files from the source dir
 */

Tree.prototype.readDir = function(dir){
    var self = this;
    var parseDir = function(dirName) {
        return fs.readdirAsync(dirName).map(function (fileName) {
            var filePath = path.join(dirName, fileName);
            return fs.statAsync(filePath).then(function(stat) {
                return stat.isDirectory() ? parseDir(filePath) : self.readFile(filePath, stat);
            });
        }).reduce(function (a, b) {
            return a.concat(b);
        }, []);
    };
    return parseDir(dir);
};

/**
 * Build a representation of the file from the filesystem,
 * including parsing any frontmatter if it exists.
 */

Tree.prototype.readFile = function(file, stat){
    
     var self = this;

    return fs.readFileAsync(file).then(function(buffer) {
        var item = {
            rootPath: file.replace(new RegExp('^(' + process.cwd() + '\.)'),""),
            absPath: path.resolve(file),
            relPath: file.replace(new RegExp('^(' + self.config.dir + '\.)'),"")
        };
        var parsed = matter(buffer.toString());
        var fileInfo = path.parse(file);
        var previewData = parsed.data.preview || {};
        delete parsed.data.preview;

        item.content = parsed.content.trim() + "\n";
        item.meta = parsed.data;
        item.data = previewData;
        item = merge(item, fileInfo);
        item.modified = stat.mtime;
        item.dir = item.dir.replace(new RegExp('^(' + self.config.dir + '\.)'),"");

        return item; 
    });
};