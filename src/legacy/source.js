var path    = require('path');
var promise = require("bluebird");
var fs      = promise.promisifyAll(require("fs"));
var _       = require('lodash');
var watch   = require('watch');

var File    = require('../src/file');
var Directory    = require('../src/directory');

module.exports = Source;

function Source(conf, name){
    if (!(this instanceof Source)) return new Source(conf);
    this.name = name;
    this.config = conf;
    this.files = null;
    this.monitor = null;
};

Source.prototype.build = function(){
    var self = this;
    this.files = this.files || this.readDir(this.config.dir);

    // .then(function(files){
    //     return _.sortByAll(files, ['relDir', 'order']);
    // });
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

    return new Directory(dir, self.config.dir).parse();
    
    

    // function dirTree(filename) {
    //     var stats = fs.lstatSync(filename);
    //     var item;

    //     if (stats.isDirectory()) {
    //         item = new Directory(filename, self.config.dir).parse();
    //     } else {
    //         // Assuming it's a file. In real life it could be a symlink or
    //         // something else!
    //         item = new File(filename, self.config.dir).parse();
    //     }

    //     return item;
    // }

    // return dirTree(dir);
};

// item.parse().then(function(dir){
//                 return fs.readdirAsync(filename).map(function(child) {
//                     item.children = dirTree(filename + '/' + child);
//                     return child;
//                 });
//             });

// function parseDir(dirName) {
//     var info = {};
//     return fs.statAsync(dirName).then(function(stat) {
//         info = {
//             path: dirName,
//             stats: stat
//         };
//         return info;
//     });



//     return fs.readdirAsync(dirName).map(function(fileName) {
//         var filePath = path.join(dirName, fileName);
        
//         return fs.statAsync(filePath).then(function(stat) {

//             return stat.isDirectory() ? {
//                 path: fileName,
//                 children: parseDir(filePath)
//             } : fileName;
            
//         });

//     });

// };


// Source.prototype.readDir = function(dir){
//     var self = this;
//     var parseDir = function(dirName) {
//         return fs.readdirAsync(dirName).map(function(fileName) {
//             var filePath = path.join(dirName, fileName);

//             return fs.statAsync(filePath).then(function(stat) {

//                 return stat.isDirectory() ? parseDir(filePath) : new File(filePath, self.config.dir).parse();
//             });

//         }).reduce(function (a, b) {

//             return a.concat(b);

//         }, []);

//     };
//     return parseDir(dir);
// };

Source.prototype.toString = function(){
    this.files.then(function(files){
        return resolve(JSON.stringify(files));
    });
};
