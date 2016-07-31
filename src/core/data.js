'use strict';

const Promise = require('bluebird');
const yaml = require('js-yaml');
const _ = require('lodash');
const Path = require('path');
const fs = Promise.promisifyAll(require('fs'));
const utils = require('./utils');
const Log = require('./log');

// module.exports = function (app) {

    // app.on('source:changed', function(source, data){
    //     if (data.type === 'config') {
    //         let filePath = Path.relative(__dirname, data.path);
    //         filePath = require.resolve(filePath);
    //         if (require.cache[filePath]) {
    //             delete require.cache[filePath];
    //         }
    //     }
    // });

module.exports = {

    parse(data, format) {
        format = format.toLowerCase();
        if (format === 'js' || format === 'javascript') {
            return data;
        } else if (format === 'json') {
            return JSON.parse(data);
        } else if (format === 'yaml') {
            return yaml.safeLoad(data);
        }
        throw new Error('Data format not recognised');
    },

    stringify(data, format) {
        format = format.toLowerCase();
        if (format === 'js' || format === 'javascript') {
            return `module.exports = ${JSON.stringify(data, null, 4)};`;
        } else if (format === 'json') {
            return JSON.stringify(data, null, 4);
        } else if (format === 'yaml') {
            return yaml.safeDump(data);
        }
        throw new Error('Data format not recognised');
    },

    readFile(filePath) {
        const format = utils.lang(filePath, true).mode;
        if (format === 'js' || format === 'javascript') {
            try {
                filePath = Path.relative(__dirname, filePath);
                delete require.cache[require.resolve(filePath)]; // Always fetch a fresh copy
                let data = require(filePath);
                if (typeof data === 'function') {
                    data = data();
                }
                if (!_.isObject(data)) {
                    Log.error(`Error loading data file ${filePath}: JS files must return a JavaScript data object.`);
                    return Promise.reject(new Error('Error loading data file'));
                }
                return Promise.resolve(data);
            } catch (e) {
                return Promise.reject(e);
            }
        } else {
            return fs.readFileAsync(filePath, 'utf8').then(contents => this.parse(contents, format)).catch(err => {
                Log.error(`Error loading data file ${filePath}: ${err.message}`);
                return {};
            });
        }
    },

    writeFile(filePath, data) {
        const pathInfo = Path.parse(Path.resolve(filePath));
        const format = utils.lang(filePath, true).mode;
        return fs.writeFileAsync(filePath, this.stringify(data, format));
    },

};

//     return module.exports;
//
// };
