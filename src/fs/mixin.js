var _           = require('lodash');
var p           = require('path');
var crypto      = require('crypto');

var File        = require('./file');
var Directory   = require('./directory');

var config      = require('../config');
var pipes       = _.sortBy(config.get('pipes'), 'priority');
var pipeCache   = {};

// Mixin for Directory and File objects
module.exports = function(){

    this.init = function(){

        var self = this;

        var fileInfo = p.parse(this.path);
        var nameParts   = fileInfo.name.match(/^(\d+)\-(.*)/,'');

        this.id         = generateUUID(this.path);
        this.ext        = this.isFile() ? fileInfo.ext : null;
        this.modified   = this.stat.mtime;

        this.fileInfo = {
            absolute:   this.path,
            relative:   this.relPath,
            name:       fileInfo.name,
            base:       fileInfo.base,
            ext:        this.ext,
        };

        this.fauxInfo = {
            absolute:   makeFauxPath(this.fileInfo.absolute),
            relative:   makeFauxPath(this.fileInfo.relative),
            name:       nameParts ? nameParts[2] : fileInfo.name,
            base:       makeFauxPath(this.fileInfo.base),
            ext:        this.ext,
        };

        this.order = parseInt(nameParts ? nameParts[1] : (this.fauxInfo.name == 'index' ? '1' : null), 10);

        this.applyPipes();

        this.title = (function(){
            if (self.isDirectory()) {
                return self.fauxInfo.name;
            }
            return self.meta.title || (self.fauxInfo.name === 'index' ? 'Overview' : self.fauxInfo.name);
        })();
    };

    this.isDirectory = function(){
        return this.type == 'directory';
    };

    this.isFile = function(){
        return this.type == 'file';
    };

    this.extMatches = function(extensions){
        return this.ext ? _.contains(extensions, this.ext) : false;
    };

    this.applyPipes = function(){
        var self = this;
        pipes.forEach(function(pipeInfo){
            if (self.extMatches(pipeInfo.matches)) {
                pipeCache[pipeInfo.name] = pipeCache[pipeInfo.name] || (function(){
                    var P = require('./pipes/' +  pipeInfo.name);
                    return new P();
                })();
                self = pipeCache[pipeInfo.name].process(self);
            }
        });
    };
    
    return this;
};

function makeFauxPath(path){
    return _.map(path.split('/'), function(segment){
        return segment.replace(/^(\d+\-)/, '');
    }).join('/');
}

function generateUUID(path){
    var shasum = crypto.createHash('sha1')
    shasum.update(path);
    return shasum.digest('hex').slice(0, 6); 
}