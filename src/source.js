'use strict';

const _            = require('lodash');
const co           = require('co');
const chokidar     = require('chokidar');
const fs           = require('./fs');
const data         = require('./data');
const logger       = require('./logger');
const match        = require('./matchers');

const transformers = new Map();
const treeCache    = new Map();
const watchers     = new Map();

transformers.set('components', require('./components/transform'));
transformers.set('pages', require('./pages/transform'));

const source = module.exports = function(dirPath, type){
    const timer = process.hrtime();
    return co(function* () {
        if (!treeCache.has(dirPath)) {

            const fileTree = yield fs.describe(dirPath);
            const sourceTree = yield source.transform(fileTree, type);

            logger.debug(process.hrtime(timer));

            treeCache.set(dirPath, sourceTree);
            source.watch(dirPath);
        }
        return treeCache.get(dirPath);
    });
};

module.exports.transform = function(fileTree, type){
    if (!transformers.has(type)) {
        throw new Error('Tranformer for ${type} not found');
    }
    return transformers.get(type)(fileTree);
};

module.exports.clear = function(dirPath) {
    treeCache.delete(dirPath);
};

module.exports.watch = function(dirPath) {
    if (!watchers.has(dirPath)) {
        const monitor = chokidar.watch(dirPath, {
            ignored: /[\/\\]\./
        });
        monitor.on('ready', () => {
            // TODO: Smarter tree rebuild rather than nuke and re-parse
            monitor.on('all', (event, path) => source.clear(dirPath));
        });
        watchers.set(dirPath, monitor);
    }
};
