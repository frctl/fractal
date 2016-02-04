'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const co      = require('co');
const chalk   = require('chalk');
const yargs   = require('yargs');
const logger  = require('./logger');
const Plugin  = require('./plugin');
const config  = require('./config');

const registry    = [];
const plugins    = new Map();

const fractal = module.exports = {

    run() {
        this._setComponentEngine();
        this._registerPlugins();

        yargs.usage('\nUsage: $0 <command> [subcommand] [options]');
        yargs.version(this.version);

        let argv = yargs.argv;

        if (argv.level) {
            this.set('log.level', argv.level);
            logger.level = this.get('log.level');
        }

        const input = this._parseArgv(argv);
        const use = plugins.get(input.command)
        if (use) {
            return use.runner()(input.command, input.args, input.opts, require('./app'));
        }

        yargs.showHelp();
        process.exit(0);
    },

    get version() {
        return config.get('version');
    },

    get env() {
        return config.get('env');
    },

    use(plugin) {
        registry.push(plugin);
    },

    _registerPlugins(){
        for (let i = 0; i < registry.length; i++) {
            const plug = new Plugin(yargs);
            require(registry[i])(plug);
            plug.config(_.defaultsDeep(this.get(`plugins.${plug.name()}`, {}), plug.defaults()));
            plug.applyCommands(yargs);
            plug.triggers.forEach(t => {
                plugins.set(t, plug);
            });
        }
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

Object.assign(fractal, config);
