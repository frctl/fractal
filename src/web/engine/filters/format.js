'use strict';

const _ = require('lodash');
const yaml = require('js-yaml');

module.exports = function (app, engine) {
    return {
        name: 'format',
        filter(obj, format) {
            format = (format || 'json').toLowerCase();
            if (_.isString(obj)) {
                return obj;
            }
            if (obj instanceof Buffer) {
                return obj.toString('UTF-8');
            }
            if (format === 'yaml' || format === 'yml') {
                return yaml.dump(obj);
            }
            if (format === 'json') {
                return JSON.stringify(obj, null, 2);
            }
            throw new Error(`Unknown format: ${format}`);
        },
    };
};
