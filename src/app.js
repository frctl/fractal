'use strict';

const Promise         = require('bluebird');
const Emitter         = require('events').EventEmitter;
const _               = require('lodash');
const co              = require('co');
const logger          = require('./logger');
const config          = require('./config');

// const handlers    = new Map();

const app = module.exports = {

    run(argv) {

        const input = this._parseArgv(argv);
        this._setComponentEngine();

        const source = require('./source');

        const promises = {
            pages: source(config.get('pages.path'), 'pages'),
            components: source(config.get('components.path'), 'components')
        };

        Promise.props(promises).then(function (p) {
            const page = p.pages.find('index');
            const render = require('./pages/engine');
            render(page.content, page.context).then(c => logger.dump(c));
            // require('./services/server');
        }).catch(function (err) {
            console.log(err.stack);
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

    _setComponentEngine(){
        const engineName = config.get('components.view.engine');
        const engine = config.get(`components.engines.${engineName}`, null);
        if (!engine) {
            throw new Error(`The component view engine '${engineName}' was not recognised.`);
        }
        engine.ext = engine.ext.toLowerCase();
        engine.context = config.get('components.view.context', {});
        config.set('components.view.config', engine);
    }

};

Object.assign(app, Emitter.prototype);
Object.assign(app, config);
