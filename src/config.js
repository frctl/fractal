var merge   = require('deepmerge');
var path    = require('path');
var _       = require('lodash');

var config = {
    port:       '3000',
    assets:     null,
    components: null,
    views:      null,
    pages:      null,
    build:      null,
    theme:      'fractal-theme-default',
    tasks:      [],
};

var directories = ['assets','components','views','pages'];

module.exports = {

    all: function(){
        return config;
    },

    get: function(key, fallback){
        return key.split('.').reduce(index, config) || fallback || null;
    },

    set: function(key, val){
        config[key] = val;
        if (key == 'theme' || _.includes(directories, key)) {
            config = expandConfig(config);
        }
    },

    merge: function(userConfig){
        config = expandConfig(merge(config, userConfig));
    }

};

function expandConfig(conf){
    var self = this;

    // expand directory configs
    conf = _.mapValues(conf, function(item, key){
        if (_.includes(directories, key) && ! _.isObject(item)) {
            return {
                dir: item
            };
        }
        return item;
    });

    // expand theme configs
    if (! _.isObject(conf['theme'])) {
        conf['theme'] = getThemeConfig(conf['theme']);
    }

    return conf;
}

function getThemeConfig(themeName){
    var dir = path.parse(require.resolve(themeName)).dir;
    var themeJSON = require(themeName);
    return {
        views: path.join(dir, themeJSON.views),
        assets: path.join(dir, themeJSON.assets),
    };
}

function index(obj,i) {
    return obj[i];
}