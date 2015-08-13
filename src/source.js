var path    = require('path');
var promise = require("bluebird");
var fs      = promise.promisifyAll(require("fs"));
var File    = require('../src/file');

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
                return stat.isDirectory() ? parseDir(filePath) : new File(filePath, self.config.dir).parse();
            });
        }).reduce(function (a, b) {
            return a.concat(b);
        }, []);
    };
    return parseDir(dir);
};