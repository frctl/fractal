const source = require('./source');
const config = require('./config');
const status = require('./components/status');

module.exports = function(){

    return {
        components: source('components'),
        pages: source('pages'),
        status: status,
        config: config.get(),
    };

};

module.exports.render = require('./render');
module.exports.logger = require('./logger');
