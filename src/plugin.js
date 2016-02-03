'use strict';

const Path     = require('path');
const _        = require('lodash');

module.exports = class Plugin {

    constructor(yargs){
        this.yargs    = yargs;
        this._config  = {};
        this.commands = [];
        this._runner  = () => {};
    }

    name(name) {
        return this.getSet('_name', name);
    }

    title(title) {
        return this.getSet('_title', title);
    }

    version(version) {
        return this.getSet('_version', version);
    }

    defaults(defaults) {
        return this.getSet('_defaults', defaults);
    }

    config(c, val) {
        if (arguments.length === 2) {
            return _.set(this._config, c, val);
        }
        if (!c) {
            return this._config;
        }
        if (_.isString(c)) {
            return _.get(this._config, c);
        }
        return this.set('_config', c);
    }

    register(name, description, command) {
        this.commands.push({
            name: name,
            description: description,
            command: command
        });
    }

    wrap(yargs, commandCount){
        yargs.option('l', {
            alias: 'level',
            default: 'warn',
            description: 'The log level to use.',
            type: 'string',
            choices: ['error','warn','info','verbose','debug','silly'],
        });
        yargs.alias('h', 'help').help('help').wrap(false);
        if (commandCount) {
            let argv = yargs.argv;
            if (argv._.length < commandCount) {
                yargs.showHelp();
                process.exit(0);
                return false;
            }
        }
    }

    runner(run) {
        if (arguments.length) {
            this._runner = run;
            return this;
        }
        return this._runner;
    }

    getSet(key, val){
        return val ? this.set(key, val) : this[key];
    }

    set(key, val) {
        this[key] = val;
        return this;
    }

    applyCommands(yargs){
        for (let command of this.commands) {
            yargs.command(command.name, command.description, command.command);
        }
    }

    get triggers(){
        return this.commands.map(c => c.name);
    }

};
