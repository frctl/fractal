'use strict';

const _       = require('lodash');
const data    = require('./data');
const logger  = require('./logger');

module.exports = {

    loadConfigFile: function(name, files, defaults) {
        defaults = defaults || {};
        const confFile = _.find(files, {'name': `${name}.config`});
        const conf = confFile ? data.readFile(confFile.path) : Promise.resolve({});
        return conf.then(c => _.defaultsDeep(c, defaults)).catch(err => {
            logger.error(`Error parsing data file ${confFile.path}: ${err.message}`);
            return defaults;
        });
    }

}
