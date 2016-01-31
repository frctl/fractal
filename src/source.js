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

const queue = [];

const source = module.exports = function (name, dirPath, type) {
    dirPath = dirPath || config.get(`${name}.path`);
    type = type || name;
    const timer = process.hrtime();
    return co(function* () {

        if (!sources.has(name) || !sources.get(name)) {
            const fileTree   = yield fs.describe(dirPath);
            const sourceTree = yield source.transform(fileTree, type);
            const srcObject  = {
                path:    dirPath,
                tree:    sourceTree,
                monitor: null,
                type: type
            };
            logger.debug(process.hrtime(timer));

            sources.set(name, srcObject);
            source.watch(name);
            source.emit('loaded', name);
        }
        return sources.get(name).tree;
    });
};

module.exports.transform = function (fileTree, type) {
    return transformers[type](fileTree);
};

module.exports.reload = function (name) {
    const sourceObj = sources.get(name);
    source.emit('reloading', name);

    if (sourceObj) {
        console.log('reloading');
        sourceObj.monitor.close();
        sources.set(name, null);
        sources.delete(name);
        source(name, sourceObj.path, sourceObj.type);
    }
};

module.exports.watch = function (name) {
    const sourceObj = sources.get(name);
    if (sourceObj && !sourceObj.monitor) {
        sourceObj.monitor = chokidar.watch(sourceObj.path, {
            ignored: /[\/\\]\./
        });
        sourceObj.monitor.on('ready', () => {
            // TODO: Smarter tree rebuild rather than nuke and re-parse
            sourceObj.monitor.on('all', (event, path) => source.reload(name));
        });
    }
};

Object.assign(module.exports, Emitter.prototype);
