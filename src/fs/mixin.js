var _           = require('lodash');
var p           = require('path');
var crypto      = require('crypto');
var swag        = require('swag');

var File        = require('./file');
var Directory   = require('./directory');

var config      = require('../config');
var pipes       = _.sortBy(config.get('pipes'), 'priority');
var pipeCache   = {};

// Mixin for Directory and File objects
module.exports = function(){

    this.init = function(){
        var self = this;
        if (! this.isRoot) {

            var fileInfo = p.parse(this.relPath);
            var fauxAbs = makeFauxPath(this.path);
            var fauxInfo = p.parse(fauxAbs);
            var nameParts   = fileInfo.name.match(/^(\d+)\-(.*)/,'');

            this.id         = generateUUID(this.path);
            this.ext        = this.isFile() ? fileInfo.ext.toLowerCase() : null;
            this.modified   = this.stat.mtime;

            this.fileInfo = {
                absolute:   this.path,
                relative:   this.relPath,
                name:       fileInfo.name,
                base:       fileInfo.base,
                dir:        fileInfo.dir,
                relDir:     this.relPath.replace(new RegExp('(\/?' + fileInfo.base + ')$'),''),
                ext:        this.ext,
            };
            
            this.fauxInfo = {
                absolute:       fauxAbs,
                relative:       makeFauxPath(this.fileInfo.relative),
                name:           nameParts ? nameParts[2] : fauxInfo.name,
                base:           fauxInfo.base,
                dir:            fauxInfo.dir,
                relDir:         makeFauxPath(this.fileInfo.relDir),
                ext:            this.ext,
            };
            this.fauxInfo.urlStylePath = this.fauxInfo.name == 'index' ? this.fauxInfo.relDir : p.join(this.fauxInfo.relDir, this.fauxInfo.name);

            this.order = parseInt(nameParts ? nameParts[1] : (this.fauxInfo.name == 'index' ? '1' : null), 10);

            this.applyPipes();

            this.title = (function(){
                if (self.isDirectory()) {
                    return titleize(self.fauxInfo.name);
                }
                return titleize(self.meta.title || (self.fauxInfo.name === 'index' ? 'Overview' : self.fauxInfo.name));
            })();
        }

        return self;
    };

    this.isDirectory = function(){
        return this.type === 'directory';
    };

    this.isFile = function(){
        return this.type === 'file';
    };

    this.isType = function(type){
        return this.type === type;
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

function titleize(str){
    return swag.helpers['titleize'](str);
}