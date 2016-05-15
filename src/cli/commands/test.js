'use strict';

module.exports = {

    command: 'test',

    config: {
        description: 'A test command',
        options: []
    },

    action: function (args, done) {
        return this.fractal.components.load().then(() => {
            
        });
    }

};
