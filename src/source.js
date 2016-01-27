'use strict';

const _        = require('lodash');
const co       = require('co');
const chokidar = require('chokidar');
const data     = require('./data');
const logger   = require('./logger');

const treeCache      = new Map();
const watchers       = new Map();

module.exports = {

    fetch(dirPath, populator){
        return co(function* (){
            if (!treeCache.has(dirPath)) {
                treeCache.set(dirPath, yield populator());
            }
            return treeCache.get(dirPath);
        });
    },

    loadConfigFile(name, files, defaults) {
        defaults = defaults || {};
        const confFile = _.find(files, {'name': `${name}.config`});
        const conf = confFile ? data.readFile(confFile.path) : Promise.resolve({});
        return conf.then(c => _.defaultsDeep(c, defaults)).catch(err => {
            logger.error(`Error parsing data file ${confFile.path}: ${err.message}`);
            return defaults;
        });
    },

    createMonitor(path, callback){
        var monitor = chokidar.watch(path, {
            ignored: /[\/\\]\./
        });
        monitor.on('ready', function(){
            monitor.on('all', callback);
        });
        return monitor;
    },

}
