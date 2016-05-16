'use strict';

module.exports = {

    command: 'test',

    config: {
        description: 'A test command',
        options: []
    },

    action: function (args, done) {
        return this.fractal.docs.load().then(source => {

            for (let item of source.flatten()) {

                item.render().then(html => {
                    this.console.log(html);
                }).catch(e => {
                    this.console.error(e);
                    this.console.log(e.stack);
                });
            }
        });
        // return this.fractal.components.load().then(source => {
        //     // this.console.dump(source.toJSON())
        //     for (let item of source.flatten()) {
        //
        //         item.render().then(html => {
        //             this.console.log(html);
        //         }).catch(e => {
        //             this.console.error(e);
        //             this.console.log(e.stack);
        //         });
        //     }
        // });
    }

};
