'use strict';

module.exports = function(fractal){

    return {
        render: require('./render.js')(fractal)
    }

};
