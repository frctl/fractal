'use strict';

module.exports = function(fractal){

    return {
        render: require('./render.js')(fractal),
        view: require('./view.js')(fractal),
        context: require('./context.js')(fractal),
    }

};
