var path    = require('path');
var promise = require("bluebird");
var fs      = promise.promisifyAll(require("fs"));
var File    = require('../src/source/file');
var Component = require('../src/source/component');

module.exports = Source;

function Source(conf){
    if (!(this instanceof Source)) return new Source(conf);
    this.config = conf;
    this.files = null;
};

Source.prototype.build = function(){
    var self = this;
    this.files = this.files || this.readDir(this.config.dir);
    return this.files;
};

Source.prototype.refresh = function(){
    // TODO: add tree refresh functionality
};

/**
 * Read all the files from the source dir
 */

Source.prototype.readDir = function(dir){
    var self = this;
    var parseDir = function(dirName) {
        return fs.readdirAsync(dirName).map(function(fileName) {
            var filePath = path.join(dirName, fileName);
            return fs.statAsync(filePath).then(function(stat) {
                return stat.isDirectory() ? parseDir(filePath) : self.getFileObject(filePath).parse();
            });
        }).reduce(function (a, b) {
            return a.concat(b);
        }, []);
    };
    return parseDir(dir);
};

Source.prototype.getFileObject = function(filePath){
    // TODO: return appropriate object type here
    return new Component(filePath, this.config.dir);
};

// Source.prototype.decorateFiles = function(files){
//      var self = this;

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
// };
