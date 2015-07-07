var absolute = require('absolute');
var assert = require('assert');
var matter = require('gray-matter');
var Path = require('path');
var rm = require('rimraf');
var utf8 = require('is-utf8');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var _ = require('lodash');
var merge = require('deepmerge');

/**
 * Export Fractal
 */

module.exports = Fractal;

/**
 * Initialize a new Fractal object with a valid directory path
 *
 * @param {String} directory
 */

function Fractal(directory){
    if (!(this instanceof Fractal)) return new Fractal(directory);
    assert(directory, 'You must pass a working directory path.');
    this.directory = directory || 'src';
    this.componentExtensions = ['.html', '.hbs'];
    this.previewDataFile = [];
};

/**
 * Get everything up and running
 */

Fractal.prototype.run = function(){
    var frctl = this;
    this.read().then(function(files){
       var files = frctl.decorateComponents(files);
       // console.log(files);
       return files;
    });
};

/**
 * Decorate a files array with component info
 *
 * @param {Array} files
 */

Fractal.prototype.decorateComponents = function(files){
    var frctl = this;
    files.map(function(file){
        if (_.contains(frctl.componentExtensions, file.meta.ext)) {

            file.isComponent = true;

            // fetch data from file, if it exists
            var data = {};
            var previewFile = _.find(files, function(file) {
                return file.path == Path.join(file.meta.dir, 'preview.json') || file.path == Path.join(file.meta.dir, 'preview.js');
            });

            console.log(file.path);
            if (previewFile) {
                data = previewFile.meta.ext == '.json' ? JSON.parse(previewFile.content) : require(previewFile.absPath);
            }

            file.data = merge(data, file.data);

            // use
            file.id = file.data.id || Path.join(file.meta.dir, file.meta.name);

        }
        return file;
    });
    return files;
};

/**
 * Read all the files from the source dir
 */

Fractal.prototype.read = function(){

    var frctl = this;
    var parseDir = function(dirName) {
        return fs.readdirAsync(dirName).map(function (fileName) {
            var path = Path.join(dirName, fileName);
            return fs.statAsync(path).then(function(stat) {
                return stat.isDirectory() ? parseDir(path) : frctl.readFile(path, stat);
            });
        }).reduce(function (a, b) {
            return a.concat(b);
        }, []);
    };

    return parseDir(this.directory);
};

/**
 * Build a representation of the file from the filesystem,
 * including parsing any frontmatter if it exists.
 */

Fractal.prototype.readFile = function(file, stat){
    var frctl = this;
    return fs.readFileAsync(file).then(function(buffer) {

        var parsed = matter(buffer.toString());
        var meta = Path.parse(file);
        meta.modified = stat.mtime;
        meta.dir = meta.dir.replace(new RegExp('^(' + frctl.directory + '\.)'),"");

        return {
            data: parsed.data,
            path: file.replace(new RegExp('^(' + frctl.directory + '\.)'),""),
            srcPath: file,
            absPath: Path.resolve(file),
            content: parsed.content,
            meta: meta
        };
    });
};