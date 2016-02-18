'use strict';

const _          = require('lodash');

module.exports = function(defaults, app){

    const commands = new Map();

    _.forEach(defaults, command => {
        add(command.name, command.callback, command.opts || {});
    });

    function add(name, callback, opts){
        commands.set(name, {
            name: name,
            callback: callback,
            opts: opts || {}
        });
    }

    return {

        add: add,

        all() {
            return Array.from(commands.values());
        },

        run(command, args, opts) {
            command = _.isString(command) ? this.get(command) : command;
            if (command) {
                return command.callback(args, opts, app);
            }
        },

        get(name) {
            return commands.get(name)
        }
    }

};
