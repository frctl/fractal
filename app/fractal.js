var absolute = require('absolute');
var assert = require('assert');
var matter = require('gray-matter');
var Path = require('path');
var rm = require('rimraf');
var utf8 = require('is-utf8');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var mkdirp = Promise.promisifyAll(require('mkdirp'));
var _ = require('lodash');
var merge = require('deepmerge');
var crypto = require('crypto');
var hbs = require('handlebars');

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
};

/**
 * Get everything up and running
 */

Fractal.prototype.build = function(){
    var frctl = this;
    return this.read(this.directory).then(function(files){
       var files = frctl.decorateComponents(files);
       return files;
    });
};

Fractal.prototype.exportComponents = function(path, files){

    var frctl = this;
    files.forEach(function(file) {
        if (file.isComponent) {
            hbs.registerPartial(file.id, file.content);
            hbs.registerPartial(file.path, file.content);
        }
    });

    rmDir(path);

    return files.forEach(function(file){
        if (file.isComponent) {
            var dirPath = Path.join(path, file.dir, '../');
            return mkdirp.mkdirpAsync(dirPath).then(function(){
                var tpl = hbs.compile(file.content);
                return fs.writeFileAsync(Path.join(dirPath, file.name + '.html'), tpl(file.data));
            });    
        }
    });

};

/**
 * Decorate a files array with component info
 *
 * @param {Array} files
 */

Fractal.prototype.decorateComponents = function(files){
    var frctl = this;

    // [first pass] - build metadata etc
    files.map(function(file){
        if (_.contains(frctl.componentExtensions, file.ext)) { // only decorate files that have a matching extension
            file.isComponent = true;
            file.data = merge(file.data, frctl.fetchData(files, file, 'preview')); // fetch preview data from file, if it exists
            file.meta = merge(file.meta, frctl.fetchData(files, file, 'meta')); // fetch metadata from file, if it exists
        }

        file.uuid = (function(path){
            var shasum = crypto.createHash('sha1')
            shasum.update(path);
            return shasum.digest('hex').slice(0, 6); 
        })(file.path);

        // set or generate the ID for the file
        file.id = file.meta.id || file.uuid;
        
        return file;
    });
       
    // [second pass] - build relationships between files
    files.map(function(file){

        if (file.isComponent) {
            file.related = [];
            // get files related by filesystem location
             _.each(files, function(item){
                if (item.dir == file.dir && item.srcPath != file.srcPath) {
                    file.related.push(item.id);
                }
            });
            // get files related via author-defined relationships
            if ( typeof file.meta.uses !== 'undefined' ) {
                file.related = merge(file.related, file.meta.uses);
            }
        }
    
    });
    return files;
};

Fractal.prototype.resolveRelation = function(files, val){
    return _.find(files, 'id', val) || _.find(files, 'path', val);
};

Fractal.prototype.fetchData = function(files, file, type){
    var data = {};
    var dataFile = _.find(files, function(item) {
        return item.path == Path.join(file.dir, type + '.json') || item.path == Path.join(file.dir, type + '.js');
    });
    if (dataFile) {
        try {
            data = dataFile.ext == '.json' ? JSON.parse(dataFile.content) : require(dataFile.absPath);    
        } catch(e) {
            // TODO: handle parsing error
            console.error('Error loading file - ' + dataFile.path);
        }
    }
    return data;
};

/**
 * Read all the files from the source dir
 */

Fractal.prototype.read = function(dir){

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

    return parseDir(dir);
};

/**
 * Build a representation of the file from the filesystem,
 * including parsing any frontmatter if it exists.
 */

Fractal.prototype.readFile = function(file, stat){
    var frctl = this;
    return fs.readFileAsync(file).then(function(buffer) {

        var item = {
            srcPath: file,
            absPath: Path.resolve(file),
            path: file.replace(new RegExp('^(' + frctl.directory + '\.)'),"")
        };
        var parsed = matter(buffer.toString());
        var fileInfo = Path.parse(file);
        var previewData = parsed.data.preview || {};
        delete parsed.data.preview;

        item.content = parsed.content.trim() + "\n";
        item.meta = parsed.data;
        item.data = previewData;
        item = merge(item, fileInfo);
        item.modified = stat.mtime;
        item.dir = item.dir.replace(new RegExp('^(' + frctl.directory + '\.)'),"");

        return item; 
    });
};

var rmDir = function(dirPath, removeSelf) {
    removeSelf = removeSelf || true;
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
  if (removeSelf)
    fs.rmdirSync(dirPath);
};