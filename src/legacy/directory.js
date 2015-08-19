var promise = require("bluebird");
var fs      = promise.promisifyAll(require("fs"));
var path    = require('path');
var crypto  = require('crypto');
var _       = require('lodash');
var File    = require('../src/file');
var config  = require('./config');

module.exports = Directory;

function Directory(rootPath, sourceDir){
    if (!(this instanceof Directory)) return new Directory(rootPath, sourceDir);
    var self = this;
    this.rootPath = rootPath;
    this.sourceDir = sourceDir || rootPath;
    this.stat = {};
    this.children = [];
    // this.monitor =

    // if (!this.monitor){
    //     // TODO: just a first POC of a watch task, need to make much more clever as to what gets re-parsed
    //     var monitorOpts = {
    //         ignoreDotFiles: true
    //     };
    //     watch.createMonitor(this.config.dir, monitorOpts, function (monitor) {

    //         monitor.on("created", function (f, stat) {
    //             self.files = self.readDir(self.config.dir);
    //             console.log('--> New files in ' + self.name);
    //         });

    //         monitor.on("changed", function (f, curr, prev) {
    //             self.files = self.readDir(self.config.dir);
    //             console.log('--> Changes in ' + self.name);
    //         });

    //         monitor.on("removed", function (f, stat) {
    //           self.files = self.readDir(self.config.dir);
    //           console.log('--> Deletions in ' + self.name);
    //         });

    //         self.monitor = monitor;
    //     });
    // }

};

Directory.prototype.parse = function(){
    var self = this; 
    return fs.statAsync(this.rootPath).then(function(stat){

        // self.stat = stat;

        // var fileInfo = path.parse(self.rootPath);
        
        // // Each file has a UUID set generated from the root path
        // self.id = self.uuid = generateUUID(self.rootPath);

        // self.rawBase    = fileInfo.base;
        // self.rawName    = fileInfo.name;

        // var nameParts   = fileInfo.name.match(/^(\d+)\.(.*)/,'');
        
        // self.name       = nameParts ? nameParts[2] : self.rawName;
        // self.base       = fileInfo.base.replace(/^(\d+\.)/,'');
        // self.order      = parseInt(nameParts ? nameParts[1] : (self.name == 'index' ? '1' : null), 10);
        
        // self.dir        = fileInfo.dir;
        // self.absPath    = path.resolve(self.rootPath);
        // self.relPath    = self.rootPath.replace(new RegExp('^(' + self.sourceDir + '\.)'),"");
        // self.relDir     = self.dir.replace(new RegExp('^(' + self.sourceDir + '\.?)'),"");

        // self.dirUrlPath = ('/' + self.relDir).replace(/(\/\d+\.)/g,'/');
        // self.urlPath    = (self.name != 'index' ? path.join(self.dirUrlPath, self.name) : self.dirUrlPath);

        // self.parentDirs = _.compact(self.relDir.split('/'));
        // self.parentUrlDirs = _.compact(self.dirUrlPath.split('/'));

        // self.depth      = self.parentDirs.length;

        self.modified   = stat.mtime;
        
        self.children = fs.readdirAsync(self.rootPath).map(function(childName) {
            var childPath = path.join(self.rootPath, childName);
            return fs.statAsync(childPath).then(function(stat) {
                return stat.isDirectory() ? new Directory(childPath, self.sourceDir).parse() : new File(childPath, self.sourceDir).parse();
            });
        });

        return self;
    });
};

Directory.prototype.toString = function(){
    var self = _.clone(this);
    return JSON.stringify(self);
};

function generateUUID(path){
    var shasum = crypto.createHash('sha1')
    shasum.update(path);
    return shasum.digest('hex').slice(0, 6); 
}

function generateTitle(file){
    return file.name;
}