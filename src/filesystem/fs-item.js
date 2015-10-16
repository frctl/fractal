/**
 * Module dependencies.
 */

var path        = require('path');
var _           = require('lodash');

/*
 * Export the mixin.
 */

module.exports = fsItem;

function fsItem(){

    this.init = function(){
        
        var fileInfo            = path.parse(this.absolutePath);
        var relativefileInfo    = path.parse(this.path);
        var nameParts           = fileInfo.name.match(/^_?(\d+)\-(.*)/,'');

        this.relativePath       = this.path;
        this.name               = fileInfo.name;
        this.base               = fileInfo.base;
        this.dir                = fileInfo.dir;
        this.relativeDir        = relativefileInfo.dir;
        this.ext                = fileInfo.ext;
        this.pathSegments       = _.compact(this.path.split('/'));

        this.modified           = this.stat.mtime;

        this.order              = nameParts ? parseInt(nameParts[1], 10) : Infinity;
        this.hidden             = !! _.find(this.pathSegments, function(segment){
                                    return segment.charAt(0) === '_';
                                });
        
        return this;
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

};

