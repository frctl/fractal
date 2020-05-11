'use strict';

const _ = require('lodash');
const chalk = require('chalk');
const chokidar = require('chokidar');
const minimist = require('minimist');
const Vorpal = require('vorpal');
const Console = require('./console');
const Notifier = require('./notifier');
const requireAll = require('require-all');
const Log = require('../core/log');
const mix = require('../core/mixins/mix');
const Configurable = require('../core/mixins/configurable');
const Emitter = require('../core/mixins/emitter');
const utils = require('../core/utils');

class Cli extends mix(Configurable, Emitter) {

    constructor(app) {
        super(app);
        this.config(app.get('cli'));

        this._app = app;
        this._commands = new Set();
        this._vorpal = new Vorpal();
        this._defaultsLoaded = false;
        this._interactive = false;
        this._configPath = null;
        this._scope = 'project';
        this._cliPackage = {};
        this._env = {};
        this._commandsDir = `${__dirname}/commands`;

        this.console = new Console(this._vorpal);
        this.console.debugMode(app.debug);

        this.notify = new Notifier(this.console, this._interactive);

        for (const method of ['log', 'error', 'warn', 'debug', 'success']) {
            this[method] = function () {
                this.console[method].apply(this.console, Array.from(arguments));
            };
            Log.on(method, (msg, data) => this[method](msg, data));
        }
    }

    has(command) {
        return !! this._vorpal.find(command);
    }

    get(command) {
        return this._vorpal.find(command);
    }

    isInteractive() {
        return this._interactive;
    }

    command(command, action, config) {
        const console = this.console;
        const vorpal = this._vorpal;
        const app = this._app;

        action = action || function () {};
        config = config || {};
        if (_.isString(config)) {
            config = {
                description: config,
            };
        }

        const commandScope = config.scope ? [].concat(config.scope) : ['project'];

        if (!_.includes(commandScope, this._scope)) {
            // command not available in this scope
            const cmd = vorpal.command(command.replace(/\</g, '[').replace(/\>/g, ']'), config.description || ' ');
            cmd.action((args, done) => {
                console.error('No Fractal CLI configuration file found. Are you running this from the root directory of your project?');
                done();
            }).hidden().__scope = commandScope;
            cmd.action = undefined; // prevent this from being overridden now it is bound
            return;
        }

        const cmd = this._vorpal.command(command, config.description || ' ');

        cmd.action(function (args, done) {
            this.console = console;
            this.fractal = app;
            return action.bind(this)(args, done);
        });
        cmd.action = undefined; // prevent this from being overridden now it is bound

        (config.options || []).forEach(opt => {
            opt = _.castArray(opt);
            cmd.option.apply(cmd, opt);
        });
        if (config.hidden) {
            cmd.hidden();
        }
        if (config.alias) {
            cmd.alias(config.alias);
        }
        cmd.__scope = commandScope;
        return cmd;
    }

    exec() {
        _.forEach(requireAll(this._commandsDir), c => this.command(c.command, c.action, c.config || {}));
        return arguments.length ? this._execFromString.apply(this, Array.from(arguments)) : this._execFromArgv();
    }

    theme(theme) {
        if (_.isString(theme)) {
            theme = require(theme);
        }
        this.console.theme = theme;
        return this;
    }

    init(scope, configPath, env, cliPackage) {
        this._scope = scope;
        this._configPath = configPath;
        this._env = env;
        this._cliPackage = cliPackage;
        return this;
    }

    get scope() {
        return this._scope;
    }

    get configPath() {
        return this._configPath;
    }

    get env() {
        return this._env;
    }

    get cliPackage() {
        return this._cliPackage;
    }

    /**
     * Run a command specified by string
     * @param  {String} command The command line string to process
     * @param  {Function} onStdout Output handler
     * @return {Promise}
     */

    _execFromString(command, onStdout) {
        const vorpal = this._vorpal;
        const app = this._app;

        if (typeof onStdout === 'Function') {
            vorpal.pipe(function (output) {
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

        return app.load().then(function () {
            return vorpal.execSync(command);
        });
    }

    /**
     * Run a command by parsing argv
     * @return {Promise}
     */

    _execFromArgv() {
        const input = utils.parseArgv();
        const console = this.console;
        const vorpal = this._vorpal;
        const app = this._app;

        if (input.command) {
            // non-interactive mode

            vorpal.ui.attach = () => {}; // fix for vorpal bug in 1.11.4
            
            if (this._scope === 'global') {
                vorpal.parse(process.argv);
                return;
            }

            return app.load().then(() => {
                vorpal.parse(process.argv);
            });
        } else {
            // interactive mode

            if (input.command && ! vorpal.find(input.command)) {
                console.error(`The ${input.command} command is not recognised.`);
                return;
            }

            if (this._scope == 'project') {
                this._interactive = true;

                console.slog().log('Initialising Fractal....');

                return app.load().then(() => {
                    app.watch();
                    this._watchConfigFile();

                    vorpal.delimiter(console.theme.delimiter());
                    vorpal.history('fractal');

                    console.box(
                        'Fractal interactive CLI',
                        `- Use the ${chalk.magenta('help')} command to see all available commands.\n- Use the ${chalk.magenta('exit')} command to exit the app.`,
                        `Powered by Fractal v${app.version}`
                    ).unslog().br();

                    return vorpal.show();
                });
            } else {
                console.box(
                    'Fractal CLI',
                    `No local Fractal configuration found.
You can use the ${chalk.magenta('fractal new')} command to create a new project.`,
                    `Powered by Fractal v${app.version}`
                ).unslog();

                return;
            }
        }
    }

    _watchConfigFile() {
        if (this._scope === 'project' && this._configPath) {
            const monitor = chokidar.watch(this._configPath);
            monitor.on('change', path => {
                this.warn('Your configuration file has changed.');
                this.warn('Exit & restart the current process to see your changes take effect.');
                monitor.close();
            });
        }
    }

}

module.exports = Cli;
