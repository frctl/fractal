var merge   = require('deepmerge');
var Tree    = require('./src/tree.js');
var _       = require('lodash');
var path    = require('path');

module.exports = new Fractal;

function Fractal(){
    this.config = {
        port:       '3000',
        assets:     null,
        components: null,
        views:      null,
        pages:      null,
        build:      null,
        theme:      'fractal-theme-default',
        tasks:      [],
    };
    this.treeKeys = ['assets','components','views','pages'];
    this.trees = {};
    this.theme = null;
};

Fractal.prototype.configure = function(config){
    this.config = this.expandConfig(merge(this.config, config));  
};

Fractal.prototype.run = function(){
    var self = this;
    this.theme = this.loadTheme(this.config.theme);
    this.treeKeys.forEach(function(treeKey){
        if (self.config[treeKey]) {
            self.trees[treeKey] = new Tree(self.config[treeKey]);
            self.trees[treeKey].build();
        }
        self.trees[treeKey] = null;
    });

    return this.getService(process.argv[2]);
};

Fractal.prototype.expandConfig = function(config){
    var self = this;
    return _.mapValues(config, function(item, key){
        if (_.includes(self.treeKeys, key) && ! _.isObject(item)) {
            return {
                dir: item
            };
        }
        return item;
    });
};

Fractal.prototype.getService = function(serviceName){
    var service = (typeof serviceName === 'undefined' || serviceName == 'server') ? 'server' : 'export';
    return require('./src/services/' +  service + '.js')(this);
};

Fractal.prototype.loadTheme = function(themeName){
    var theme = {};
    var dir = path.parse(require.resolve(themeName)).dir;
    var themeJSON = require(themeName);
    theme.views = path.join(dir, themeJSON.views);
    theme.assets = path.join(dir, themeJSON.assets);
    return theme;
};