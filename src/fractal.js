'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const co      = require('co');
const chalk   = require('chalk');
const yargs   = require('yargs');
const logger  = require('./logger');
const Service = require('./service');
const config  = require('./config');

const registry    = [];
const services    = new Map();

const fractal = module.exports = {

    run() {
        this._setComponentEngine();
        this._registerServices();

        yargs.usage('\nUsage: $0 <command> [subcommand] [options]');
        yargs.version(this.version);

        let argv = yargs.argv;

        if (argv.level) {
            this.set('log.level', argv.level);
            logger.level = this.get('log.level');
        }

        const input = this._parseArgv(argv);
        const srv = services.get(input.command)
        if (srv) {
            return srv.runner()(input.command, input.args, input.opts, require('./app'));
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

    _registerServices(){
        for (let i = 0; i < registry.length; i++) {
            const plugin = new Service(yargs);
            require(registry[i])(plugin);
            plugin.config(_.defaultsDeep(this.get(`services.${plugin.name()}`, {}), plugin.defaults()));
            plugin.applyCommands(yargs);
            plugin.triggers.forEach(t => {
                services.set(t, plugin);
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
