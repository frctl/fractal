var path = require('path');
var promise = require("bluebird");
var fs = promise.promisifyAll(require("fs"));
var _ = require('lodash');
var matter = require('gray-matter');
var absolute = require('absolute');
var merge = require('deepmerge');

module.exports = File;

function File(filePath, fractal){
    if (!(this instanceof File)) return new File(filePath, fractal);
    this.filePath = filePath;
    this.stat = {};
    return this.init(fractal);
};

File.prototype.init = function(fractal){
    var self = this;
    return fs.statAsync(this.filePath).then(function(stat){
        self.stat = stat;
        return stat;
    });
};