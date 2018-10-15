'use strict';

module.exports = function(fractal){

    return {
        render: require('./render.js')(fractal),
        context: require('./context.js')(fractal),
        contextData: require('./context-data.js')(fractal),
        view: require('./view.js')(fractal),
        path: require('./path.js')(fractal),
    }

};
