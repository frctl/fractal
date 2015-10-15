var Directory   = require('../fs/directory');

module.exports = SourceFactory;

function SourceFactory(){};

SourceFactory.getSource = function(key, config){
    if (config) {
        var Source = require('./' + key.replace(/\s$/,''));   
        var dir = Directory.fromPath(config.dir, null, true);
        return Source.fromDirectory(dir, config);
    }
    return null;
};
