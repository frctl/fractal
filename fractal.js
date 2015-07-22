var merge = require('deepmerge');
var Tree = require('./src/tree.js');

module.exports = new Fractal;

function Fractal(){
    this.config = {
        port:       '3000',
        assets:     null,
        components: null,
        views:      null,
        docs:       null,
        build:      null,
        tasks:      [],
    };
};

Fractal.prototype.configure = function(config){
    this.config = merge(this.config, config);
};

Fractal.prototype.run = function(){
    var fileTree = new Tree(this.config);
    var service = (typeof process.argv[2] === 'undefined' || process.argv[2] == 'server') ? 'server' : 'export';
    return require('./src/services/' +  service + '.js')(this.config, fileTree);
};