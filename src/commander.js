'use strict';

const _   = require('lodash');
const cli = require('./cli');

module.exports = function (defaults, app) {

    const commands = new Map();

    _.forEach(defaults, command => {
        add(command.name, command.callback, command.opts || {});
    });

    function add(name, callback, opts) {
        opts.scope = opts.scope ? [].concat(opts.scope) : ['local'];
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
            const scope = app.global ? 'global' : 'local';
            if (command) {
                if (_.includes(command.opts.scope, scope)) {
                    return command.callback(args, opts, app);
                } else {
                    cli.error(`The '${command.name}' command cannot be run ${scope}ly.`);
                }
            }
        },

        get(name) {
            return commands.get(name);
        }
    };

};
