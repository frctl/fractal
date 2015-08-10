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
    // this.componentExtensions = 
};

Tree.prototype.build = function(){
    var self = this;
    this.files = this.readDir(this.config.dir);
    this.files.then(function(files){
        return self.decorateFiles(files);
        // console.log("\n ---- \n");
        // console.log(tree);
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

Tree.prototype.decorateFiles = function(files){
     var self = this;

    // 1. run through tree, for each component/view fetch preview data and metadata from associated (by proximity) files, if they exist.
    // 2. generate a UUID for the component/view if one is not set




    // files.map(function(file){
    //     if (_.contains(frctl.componentExtensions, file.ext)) { // only decorate files that have a matching extension
    //         file.isComponent = true;
    //         file.data = merge(file.data, frctl.fetchData(files, file, 'preview')); // fetch preview data from file, if it exists
    //         file.meta = merge(file.meta, frctl.fetchData(files, file, 'meta')); // fetch metadata from file, if it exists
    //     } else {
    //         file.isComponent = false;
    //     }

    //     file.uuid = (function(path){
    //         var shasum = crypto.createHash('sha1')
    //         shasum.update(path);
    //         return shasum.digest('hex').slice(0, 6); 
    //     })(file.path);

    //     // set or generate the ID for the file
    //     file.id = file.meta.id || file.uuid;
        
    //     return file;
    // });
};

Tree.prototype.fetchDataForFile = function(files, file, dataType){

};

Tree.prototype.isRenderable = function(files, file, dataType){

};