'use strict';

const chokidar = require('chokidar');
const Console = require('./console');
const Notifier = require('./notifier');
const Log = require('../../core').Log;
const mix = require('../../core').mixins.mix;
const Emitter = require('../../core').mixins.emitter;
const utils = require('../../core').utils;
const start = require('./commands/web.start');
const build = require('./commands/web.build');

class Cli extends mix(Emitter) {
    constructor(app) {
        super(app);

        this._app = app;
        this._configPath = null;

        this.console = new Console();
        this.console.debugMode(app.debug);

        this.notify = new Notifier(this.console, this._interactive);

        for (const method of ['log', 'error', 'warn', 'debug', 'success']) {
            this[method] = function () {
                this.console[method].apply(this.console, Array.from(arguments));
            };
            Log.on(method, (msg, data) => this[method](msg, data));
        }
    }

    /**
     * Run a command by parsing argv
     * @return {Promise}
     */
    exec() {
        const input = utils.parseArgv();

        const console = this.console;
        const app = this._app;

        return app.load().then(() => {
            let command;

            if (input.command === 'start') {
                command = start;
            }

            if (input.command === 'build') {
                command = build;
            }

            command.console = console;
            command.fractal = app;
            command.action({ options: input.opts });
        });
    }

    init(configPath) {
        this._configPath = configPath;
        return this;
    }

    get configPath() {
        return this._configPath;
    }

    get cliPackage() {
        return this._cliPackage;
    }

    _watchConfigFile() {
        if (this._configPath) {
            const monitor = chokidar.watch(this._configPath);
            monitor.on('change', () => {
                this.warn('Your configuration file has changed.');
                this.warn('Exit & restart the current process to see your changes take effect.');
                monitor.close();
            });
        }
    }
}

module.exports = Cli;
