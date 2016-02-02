'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const co      = require('co');
const chalk   = require('chalk');
const yargs   = require('yargs');
const logger  = require('./logger');
const config  = require('./config');

const registry    = Object.create({});
const commands    = new Map();
const services    = new Map();

const fractal = module.exports = {

    run() {
        this._setComponentEngine();
        this._registerServices();

        yargs.usage('\nUsage: $0 <command> [subcommand] [options]');
        yargs.version(this.version);
        commandify(yargs, 1);

        let argv = yargs.argv;

        if (argv.level) {
            this.set('log.level', argv.level);
            logger.level = this.get('log.level');
        }

        const input = this._parseArgv(argv);
        const serviceName = commands.get(input.command)
        if (serviceName) {
            const service = services.get(serviceName);
            if (service) {
                return service.run(input.command, input.args, input.opts, require('./app'));
            }
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

    use(name, service) {
        if (arguments.length === 1) {
            service = name;
            name = service.getName();
        }
        registry[name] = service;
    },

    _registerServices(){
        for (let name in registry) {
            let service = registry[name];
            const conf = _.defaultsDeep(this.get(`services.${name}`, {}), service.getDefaults());
            for (let command of service.getCommands(commandify, conf)) {
                yargs.command(command.name, command.description, command.command);
                commands.set(command.name, name);
            }
            services.set(name, new service(conf));
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

function commandify(yargs, numArgsRequired)  {
    yargs.option('l', {
        alias: 'level',
        default: 'warn',
        description: 'The log level to use.',
        type: 'string',
        choices: ['error','warn','info','verbose','debug','silly'],
    });
    yargs.alias('h', 'help').help('help').wrap(false);
    if (numArgsRequired) {
        let argv = yargs.argv;
        if (argv._.length < numArgsRequired) {
            yargs.showHelp();
            process.exit(0);
            return false;
        }
    }
};

Object.assign(fractal, config);
