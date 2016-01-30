'use strict';

const _            = require('lodash');
const co           = require('co');
const Emitter      = require('events').EventEmitter;
const chokidar     = require('chokidar');
const fs           = require('./fs');
const data         = require('./data');
const logger       = require('./logger');
const config       = require('./config');
const match        = require('./matchers');

const sources      = new Map();
const transformers = {
    pages:       require('./pages/transform'),
    components: require('./components/transform')
};

const source = module.exports = function(name, dirPath, type){
    dirPath     = dirPath || config.get(`${name}.path`);
    type = type || name;
    const timer = process.hrtime();
    return co(function* () {

        if (!sources.has(name)) {
            const fileTree   = yield fs.describe(dirPath);
            const sourceTree = yield source.transform(fileTree, type);
            const srcObject  = {
                path:    dirPath,
                tree:    sourceTree,
                monitor: null,
                type: type
            }
            logger.debug(process.hrtime(timer));

            sources.set(name, srcObject);
            source.watch(name);
        }
        return sources.get(name).tree;
    });
};

module.exports.transform = function(fileTree, type){
    return transformers[type](fileTree);
};

module.exports.clear = function(name) {
    const sourceObj = sources.get(name);
    sourceObj.monitor.close();
    sources.delete(name);
    source.emit('changed', name);
};

module.exports.watch = function(name) {
    if (!sources.has(name)) {
        const sourceObj = sources.get(name);
        sourceObj.monitor = chokidar.watch(sourceObj.path, {
            ignored: /[\/\\]\./
        });
        sourceObj.on('ready', () => {
            // TODO: Smarter tree rebuild rather than nuke and re-parse
            sourceObj.on('all', (event, path) => source.clear(name));
        });
    }
};

Object.assign(source, Emitter.prototype);
