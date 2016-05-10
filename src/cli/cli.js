'use strict';

const _            = require('lodash');
const mix          = require('mixwith').mix;
const chalk        = require('chalk');
const minimist     = require('minimist');
const Vorpal       = require('vorpal');
const Console      = require('./console');
const Log          = require('../core/log');
const Base         = require('../core/mixins/base');
const Configurable = require('../core/mixins/configurable');
const utils        = require('../core/utils');

class Cli extends mix(Base).with(Configurable) {

    constructor(app){

        super(app);

        this.setConfig(app.get('cli'));

        this._app      = app;
        this._commands = new Set();
        this._vorpal   = new Vorpal();
        this.scope     = 'project';
        this.console   = new Console(this._vorpal);
        this.console.debugMode(app.debug);

        for (let method of ['log', 'error', 'alert', 'debug']) {
            this[method] = (msg) => {
                this.console[method](msg);
            }
            Log.on(method, msg => this[method](msg));
        }
    }

    has(command) {
        return !! this._vorpal.find(command);
    }

    get(command) {
        return this._vorpal.find(command);
    }

    command(command, config, action) {

        const console = this.console;
        const vorpal  = this._vorpal;
        const app     = this._app;

        if (_.isFunction(config)) {
            action = config;
            config = {};
        }
        if (_.isString(config)) {
            config = {
                description: config
            };
        }
        action = action || function () {};

        const cmd = this._vorpal.command(command, config.description || ' ');

        cmd.action(function (args, done) {
            this.console = console;
            this.fractal = app;
            return action.bind(this)(args, done);
        });

        (config.options || []).forEach(opt => {
            opt = _.castArray(opt);
            cmd.option.apply(cmd, opt);
        });

        if (config.hidden) {
            cmd.hidden();
        }
    }

    exec(){
        return arguments.length ? this._execFromString(...arguments) : this._execFromArgv();
    }

    /**
     * Run a command specified by string
     * @param  {String} command The command line string to process
     * @param  {Function} onStdout Output handler
     * @return {Promise}
     */

    _execFromString(command, onStdout){

        const vorpal  = this._vorpal;
        const app     = this._app;

        if (typeof onStdout === 'Function') {
            vorpal.pipe(function(output){
                if (output) {
                    output = output[0];
                    const ret = onStdout(output);
                    if (ret) {
                        return ret;
                    }
                    return '';
                }
            });
        }

        return app.load().then(function() {
            return vorpal.execSync(command);
        });
    }

    /**
     * Run a command by parsing argv
     * @return {Promise}
     */

    _execFromArgv(){

        const input   = utils.parseArgv();
        const console = this.console;
        const vorpal  = this._vorpal;
        const app     = this._app;

        if (input.command) {

            // non-interactive mode

            return app.load().then(() => {
                return vorpal.parse(process.argv);
            });

        } else {

            // interactive mode

            if (input.command && ! vorpal.find(input.command)) {
                console.error(`The ${input.command} command is not recognised.`);
                return;
            }

            if (this.scope == 'project') {

                console.slog().log('Initialising Fractal....');

                return app.load().then(() => {

                    app.watch();

                    vorpal.delimiter(console.themeValue('delimiter'));
                    vorpal.history('fractal');

                    console.box(
                        `Fractal interactive CLI`,
                        `- Use the 'help' command to see all available commands.\n- Use the 'exit' command to exit the app.`,
                        `Powered by Fractal v${app.version}`
                    ).unslog().br();

                    return vorpal.show();
                });

            } else {

                console.box(
                    `Fractal CLI`,
                    `${chalk.magenta('No local Fractal configuration found.')}
You can use the 'fractal new' command to create a new project.`,
                    `Powered by Fractal v${app.version}`
                ).unslog();

                return;

            }
        }
    }

    theme(theme) {
        if (_.isString(theme)) {
            theme = require(theme);
        }
        this.console.theme(theme);
        return this;
    }

    setLogger(logger) {
        this.console = logger;
    }

}

module.exports = Cli;
