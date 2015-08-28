var _           = require('lodash');
var p           = require('path');
var crypto      = require('crypto');
var swag        = require('swag');
var minimatch   = require('minimatch');

var File        = require('./file');
var Directory   = require('./directory');

var config      = require('../config');
var pipes       = _.sortBy(config.get('pipes'), 'priority');
var pipeCache   = {};

// Mixin for Directory and File objects
module.exports = function(){

    this.init = function(){

        var self = this;
        var fileInfo = p.parse(this.relPath);

        this.name = fileInfo.name;
        this.data = {};

        if (! this.isRoot) {    
            var fauxAbs = makeFauxPath(this.path);
            var fauxInfo = p.parse(fauxAbs);
            var nameParts   = fileInfo.name.match(/^_?(\d+)\-(.*)/,'');
            
            this.ext        = this.isFile() ? fileInfo.ext.toLowerCase() : null;
            this.modified   = this.stat.mtime;
            
            this.fileInfo = {
                absolute:   this.path,
                relative:   this.relPath,
                pathSegments: _.compact(this.relPath.split('/')),
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
            this.fauxInfo.pathSegments = _.compact(this.fauxInfo.relative.split('/')),

            this.order = parseInt(nameParts ? nameParts[1] : (this.fauxInfo.name == 'index' ? '1' : 10000), 10);
            this.order = isNaN(this.order) ? 10000 : this.order;
            this.depth = (_.compact(this.relPath.split('/'))).length - 1;

            if (this.isFile()){
                this.applyPipes();    
            }

            this.uuid = generateUUID(this.path);

            this.data = this.data || {};

            Object.defineProperty(this, 'id', {
                get: this.getId
            });

            Object.defineProperty(this, 'title', {
                get: this.getTitle
            });

            Object.defineProperty(this, 'hidden', {
                get: this.isHidden
            });
        }

        return self;
    };

    this.isHidden = function(){
        var self = this;
        var hidden = false;
        if (_.isUndefined(this.data.hidden)) {
            this.fauxInfo.pathSegments.forEach(function(part){
                if (part.charAt(0) === '_') {
                    hidden = true;
                }
            });
        } else {
            hidden = this.data.hidden;
        }
        return hidden;
    };

    this.getId = function(){
        return _.get(this.data, 'id', this.uuid);
    };

    this.getTitle = function(){
        if (this.isDirectory()) {
            return titleize(this.fauxInfo.name);
        }
        return titleize(this.data.title || (this.fauxInfo.name === 'index' ? 'Overview' : this.fauxInfo.name));
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

    this.applyPipes = function(){
        var self = this;
        pipes.forEach(function(pipeInfo){
            if (minimatch(self.fileInfo.base, pipeInfo.matches)) {
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