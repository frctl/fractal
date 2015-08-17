var merge       = require('deepmerge');
var path        = require('path');
var _           = require('lodash');

var config =  require('../config.json');

module.exports = {

    all: function(){
        return config;
    },

    get: function(key, fallback){
        return key.split('.').reduce(index, config) || fallback || null;
    },

    set: function(key, val){
        config[key] = val;
        if (key == 'theme' || _.includes(this.get('sources'), key)) {
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
        if (_.includes(conf.sources, key) && _.isString(item) ) {
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