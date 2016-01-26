'use strict';

var config = require('../config');

module.exports = {

    load(directoryPath) {

    },

    get components() {

        return new Promise.resolve([{ comp: 'foo' }]);
    }

};
