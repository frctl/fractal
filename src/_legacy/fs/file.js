var promise     = require("bluebird");
var fs          = promise.promisifyAll(require("fs"));
var p           = require('path');
var crypto      = require('crypto');
var _           = require('lodash');
var minimatch   = require('minimatch');
var fs          = require("fs");
var output      = require("../output");

var vc          = require('../vc');
var mixin       = require('./mixin');

module.exports = File;

function File(opts){
    this.type       = 'file';
    this.path       = opts.path;
    this.relPath    = opts.relPath;
    this.stat       = opts.stat;
    this.content    = this.raw = opts.content;
};

mixin.call(File.prototype);

File.fromPath = function(path, relativeTo){
    var stat = fs.statAsync(path);    
    var content = fs.readFileAsync(path);
    var relPath = _.trimLeft(path.replace(new RegExp('^(' + relativeTo + ')'),""),['/']);
    return promise.join(stat, content, function(stat, content) {
        return new File({
            path:       p.resolve(path),
            relPath:    relPath,
            stat:       stat,
            content:    content
        }).init();
    });
};

File.prototype.matches = function(key, value){
    value = value.replace('__name__', this.fauxInfo.name);
    return (_.get(this, key) === value || minimatch(_.get(this, key), value));
};

File.prototype.toJSON = function(){
    var clone = _.clone(this);
    clone.content = clone.content.toString();
    clone.raw = clone.raw.toString();
    return clone;
};

File.prototype.toString = function(){
    return this.toJSON();
};

File.prototype.getHistory = function(){
    if (vc.hasVC()) {
        return vc.getLatestCommitsForFile(this.relPath).then(function(commits){
            return commits ? _.map(commits, function(commit){
                return {
                    message: _.trim(commit.message()),
                    sha: commit.sha(),
                    date: commit.date(),
                    author: {
                        name: commit.author().name(),
                        email: commit.author().email()
                    }
                }
            }) : null;
        });
    }
    return promise.resolve(null);
};

File.prototype.render = function(data) {
    return output.render(this.content.toString() || "", data);
};