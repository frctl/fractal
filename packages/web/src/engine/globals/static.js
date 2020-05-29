'use strict';

module.exports = function () {
    return {
        name: 'static',
        value(path) {
            return path;
        },
    };
};
