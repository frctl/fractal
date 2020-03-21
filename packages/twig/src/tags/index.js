'use strict';

module.exports = function(fractal, config){

    return {
        render: require('./render.js')(fractal, config)
    }

};
