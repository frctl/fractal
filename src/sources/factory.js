var Directory   = require('../fs/directory');

module.exports = SourceFactory;

function SourceFactory(){};

SourceFactory.getSource = function(key, config){
    if (config) {
        var Source = require('./' + key.replace(/\s$/,''));
        return Directory.fromPath(config.dir, null, true).then(function(dir){
            var src = new Source(config, dir);
            src.init();
            return src;
        });
    }
    return null;
};
