'use strict';

var Promise = require('bluebird');
var yaml    = require('js-yaml');
var _       = require('lodash');
var Path    = require('path');
var fs      = Promise.promisifyAll(require('fs'));
var utils   = require('./utils');
var logger  = require('./logger');

const self = module.exports = {

    parse(data, format){
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

    stringify(data, format){
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

    readFile(filePath){
        if (Path.isAbsolute(filePath)) {
            return Promise.reject("Data file paths must be relative to the root of the project");
        }
        const format = utils.guessLanguage(filePath, true);
        if (format === 'js' || format === 'javascript') {
            try {
                filePath = Path.relative(__dirname, filePath);
                delete require.cache[require.resolve(filePath)]; // Always fetch a fresh copy
                return Promise.resolve(require(filePath));
            } catch(e) {
                return Promise.reject(e);
            }
        } else {
            return fs.readFileAsync(filePath, 'UTF-8').then(function(contents){
                return self.parse(contents, format);
            }).catch(function(err){
                logger.error(`Error loading data file ${filePath}: ${err.message}`);
                return {};
            });
        }
    },

    writeFile(filePath, data){
        const pathInfo = path.parse(path.resolve(filePath));
        const format = utils.guessLanguage(filePath, true);
        return fs.writeFileAsync(filePath, this.stringify(data, format));
    }
};
