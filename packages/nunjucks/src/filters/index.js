'use strict';

module.exports = function(fractal){

    return {
        path: require('./path.js')(fractal),
    }

};
