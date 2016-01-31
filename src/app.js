'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const co      = require('co');
const logger  = require('./logger');
const config  = require('./config');


// const handlers    = new Map();

const app = module.exports = {

    run(argv) {

        const input = this._parseArgv(argv);
        this._setComponentEngine();

        const server  = require('./services/server');

        co(function* run(){

            const source = require('./source');
            const pRender = require('./pages/render');
            const cRender = require('./components/render');
            const context = require('./components/context');
            const status = require('./components/status');

            const p = yield {
                pages: source('pages'),
                components: source('components')
            };

            const page = p.pages.find('index');
            // logger.dump(page.context);
            // console.log(yield pRender(page));
            // console.log('----');

            for (let item of p.pages.flatten()) {
                // console.log(item.handle);
            }

            // console.log('---');

            for (let item of p.components.flatten()) {
                for (let v of item.getVariants()) {
                    // console.log(v.files.view.path);
                }
            }

            console.log('----');

            const comp = p.components.find('button');
            console.log(status(comp.statuses));
            // const ctx = yield context(comp.context);
            // logger.dump(cRender(comp).catch(e => console.log(e)));
            // logger.dump(ctx);

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
        let engine;
        const moduleName = config.get('components.view.engine');
        try {
            engine = require(moduleName);
        } catch(err) {
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
