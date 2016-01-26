'use strict';

const Emitter         = require('events').EventEmitter;
const _               = require('lodash');
const co              = require('co');
const logger          = require('./logger');
const config          = require('./config');
const pages           = require('./pages');

// const handlers    = new Map();

const app = module.exports = {

    run(argv) {
        const input = this._parseArgv(argv);
        
        // console.time('tree');
        pages.load().then(function (tree) {
            // console.timeEnd('tree');
            logger.dump(tree);
            // console.log(JSON.stringify(tree, function(key, val){
            //     if (val instanceof Buffer || val.type == 'Buffer') {
            //         return '<Buffer>';
            //     }
            //     return val;
            // }, 4));
        }).catch(function(err){
            console.log(err);
        });
    },

    get version() {
        return config.get('version');
    },

    get env() {
        return config.get('env');
    },

    /*
     * Parse the supplied argv to extract a command, arguments and options
     *
     * @api private
     */

    _parseArgv: function (argv) {
        const args = argv._;
        const command = args.shift();
        const opts = argv;
        delete opts._;
        delete opts.$0;
        return {
            command: command,
            args: args,
            opts: opts
        };
    }

};

Object.assign(app, Emitter.prototype);
Object.assign(app, config);
