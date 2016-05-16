'use strict';

module.exports = {

    command: 'test',

    config: {
        description: 'A test command',
        options: []
    },

    action: function (args, done) {
        return this.fractal.components.load().then(source => {
            this.console.dump(source.toJSON())
            // for (let item of source.flatten()) {
            //     // console.log(item.status);
            // }
        });
    }

};
