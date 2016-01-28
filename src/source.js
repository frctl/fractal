'use strict';

const _         = require('lodash');
const co        = require('co');
const chokidar  = require('chokidar');
const data      = require('./data');
const logger    = require('./logger');

const treeCache = new Map();
const watchers  = new Map();

module.exports = {

    fetch(dirPath, populator){
        var self = this;
        return co(function* (){
            if (!treeCache.has(dirPath)) {
                treeCache.set(dirPath, yield populator());
                self.watch(dirPath);
            }
            return treeCache.get(dirPath);
        });
    },

    clear(dirPath){
        treeCache.delete(dirPath);
    },
    
    watch(dirPath){
        if (!watchers.has(dirPath)) {
            const monitor = chokidar.watch(dirPath, {
                ignored: /[\/\\]\./
            });
            monitor.on('ready', () => {
                monitor.on('all', (event, path) => this.refresh(event, path, dirPath));
            });
            watchers.set(dirPath, monitor);
        }
    },

    loadConfigFile(name, files, defaults) {
        defaults = defaults || {};
        const confFile = _.find(files, {'name': `${name}.config`});
        const conf = confFile ? data.readFile(confFile.path) : Promise.resolve({});
        return conf.then(c => _.defaultsDeep(c, defaults)).catch(err => {
            logger.error(`Error parsing data file ${confFile.path}: ${err.message}`);
            return defaults;
        });
    }

}
