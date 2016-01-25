'use strict';

const Emitter     = require('events').EventEmitter;
const _           = require('lodash');
const config      = require('./config');

const handlers    = new Map();

const app = module.exports = {

    run(argv){
        let input = this._parseArgv(argv);
        let handler = handlers.get(input.command);
        if (handler) {
            handler(input);
        }
    },

    register(handler, callback){
        handlers.set(handler, callback);
    },

    get version(){
        return config.get('version');
    },

    get env(){
        return config.get('env');
    },

    /*
     * Parse the supplied argv to extract a command, arguments and options
     *
     * @api private
     */

    _parseArgv: function(argv){
        var args = argv._;
        var command = args.shift();
        var opts = argv;
        delete opts._;
        delete opts.$0;
        return {
            command: command,
            args: args,
            opts: opts
        }
    }

};

Object.assign(app, Emitter.prototype);
Object.assign(app, config);
