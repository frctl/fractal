'use strict';

module.exports = function () {
    return {
        name: 'dump',
        value(obj, preformat) {
            preformat = preformat === false ? false : true;
            const output = JSON.stringify(obj, null, 4);
            return preformat ? '<pre>' + output + '</pre>' : output;
        },
    };
};
