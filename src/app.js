'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const co      = require('co');
const logger  = require('./logger');
const config  = require('./config');
const browser = require('./services/browser');

// const handlers    = new Map();

const app = module.exports = {

    run(argv) {

        const input = this._parseArgv(argv);
        this._setComponentEngine();

        const browserConfig = _.defaultsDeep(this.get('browser', {}), browser.config);
        console.log(browserConfig);

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

    _parseArgv(argv) {
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
    },

    _setComponentEngine() {
        let engine;
        const moduleName = config.get('components.view.engine');
        try {
            engine = require(moduleName);
        } catch (err) {
            throw new Error(`Could not find component engine module '${moduleName}'. Try running 'npm install ${moduleName} --save'.`);
        }
        const ext = config.get('components.view.ext') || engine.defaults.ext;
        if (!ext) {
            throw new Error(`No component extension found!`);
        }
        config.set('components.view.ext', ext.toLowerCase());
    }

};

Object.assign(app, config);
