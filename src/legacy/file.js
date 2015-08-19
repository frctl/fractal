var promise = require("bluebird");
var fs      = promise.promisifyAll(require("fs"));
var path    = require('path');
var crypto  = require('crypto');
var _       = require('lodash');

var config  = require('./config');
var parsers = _.sortBy(config.get('parsers'), 'priority');
var parserObjs = {};

module.exports = File;

function File(rootPath, sourceDir){
    if (!(this instanceof File)) return new File(rootPath, sourceDir);
    var self = this;
    var content = '';
    this.rootPath = rootPath;
    this.sourceDir = sourceDir;
    this.stat = {};
    this.raw = '';

    Object.defineProperty(this, 'content', {
        get: function() {
            if (_.isFunction(content)) {
                content = content(this.raw.toString());
            }
            return content.toString();
        },
        set: function(value) {
            content = value;
        }
    });

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

            var fileInfo = path.parse(self.rootPath);
            
            // Each file has a UUID set generated from the root path
            self.id = self.uuid = generateUUID(self.rootPath);

            // keep the raw contents
            self.raw = buffer;

            self.rawBase    = fileInfo.base;
            self.rawName    = fileInfo.name;
            self.ext        = fileInfo.ext;

            var nameParts   = fileInfo.name.match(/^(\d+)\.(.*)/,'');
            
            self.name       = nameParts ? nameParts[2] : self.rawName;
            self.base       = fileInfo.base.replace(/^(\d+\.)/,'');
            self.order      = parseInt(nameParts ? nameParts[1] : (self.name == 'index' ? '1' : null), 10);
            
            self.dir        = fileInfo.dir;
            self.absPath    = path.resolve(self.rootPath);
            self.relPath    = self.rootPath.replace(new RegExp('^(' + self.sourceDir + '\.)'),"");
            self.relDir     = self.dir.replace(new RegExp('^(' + self.sourceDir + '\.?)'),"");

            self.dirUrlPath = ('/' + self.relDir).replace(/(\/\d+\.)/g,'/');
            self.urlPath    = (self.name != 'index' ? path.join(self.dirUrlPath, self.name) : self.dirUrlPath);

            self.parentDirs = _.compact(self.relDir.split('/'));
            self.parentUrlDirs = _.compact(self.dirUrlPath.split('/'));

            self.depth      = self.parentDirs.length;

            self.modified   = stat.mtime;
            
            self.meta       = {};
            self.preview    = {};

            runParsers(self);
            
            self.title = generateTitle(self);

            return self;
        });
    });
};

File.prototype.toString = function(){
    var self = _.clone(this);
    self.raw = self.raw.toString();
    self.content = self.content.toString();
    return JSON.stringify(self);
};

function runParsers(file){
    parsers.forEach(function(parserInfo){
        if (_.contains(parserInfo.matches, file.ext)) {
            parserObjs[parserInfo.name] = parserObjs[parserInfo.name] || (function(){
                var P = require('./parsers/' +  parserInfo.name);
                return new P();
            })();
            parserObjs[parserInfo.name].parse(file);
        }
    });
};

function generateUUID(path){
    var shasum = crypto.createHash('sha1')
    shasum.update(path);
    return shasum.digest('hex').slice(0, 6); 
}

function generateTitle(file){
    return file.meta.title || (function(){
        return file.name === 'index' ? 'Overview' : file.name;
        // return file.name === 'index' ? (_.last(file.parentDirs) || 'Overview') : file.name;
    })();
}