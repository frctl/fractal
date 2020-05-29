'use strict';

module.exports = function () {
    return {
        name: 'isError',
        filter(item) {
            return item instanceof Error;
        },
    };
};
