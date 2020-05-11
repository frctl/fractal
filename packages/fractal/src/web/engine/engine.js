'use strict';

const Promise = require('bluebird');
const Path = require('path');
const nunjucks = require('nunjucks');
const yaml = require('js-yaml');
const _ = require('lodash');
const requireAll = require('require-all');
const Log = require('../../core/log');
const WebError = require('../error');
const extensions = requireAll(`${__dirname}/extensions`);
const filters = requireAll(`${__dirname}/filters`);
const globals = requireAll(`${__dirname}/globals`);

const templateError = nunjucks.lib.TemplateError;
let lastError = null;

nunjucks.lib.TemplateError = function (message, lineno, colno) {
    if (message instanceof WebError) {
        message.lineno = lineno;
        message.colno = colno;
        lastError = message;
        throw message;
    }

    const err = new templateError(message, lineno, colno);

    lastError = err;

    return err;
};

module.exports = class Engine {

    constructor(viewsPath, env, app) {
        this._app = app;
        this._env = env;
        this.theme = null;

        this._globals = {
            components: app.components,
            docs: app.docs,
            assets: app.assets,
            env: {},
            get(path, fallback) {
                return app.get(path, fallback);
            },
        };

        viewsPath = [].concat(viewsPath);

        const views = viewsPath.concat([
            Path.join(__dirname, '../../../views/web'),
        ]);

        const loader = new nunjucks.FileSystemLoader(views, {
            watch: false,
            noCache: true,
        });

        this._engine = Promise.promisifyAll(new nunjucks.Environment(loader, {
            autoescape: false,
        }));

        _.forEach(extensions, factory => {
            const e = factory(app, this);
            this._engine.addExtension(e.name, new e.extension);
        });

        _.forEach(filters, factory => {
            const f = factory(app, this);
            this._engine.addFilter(f.name, f.filter, f.async);
        });

        _.forEach(globals, factory => {
            const g = factory(app, this);
            this._engine.addGlobal(g.name, g.value);
        });
    }

    get lastError() {
        return lastError;
    }

    get engine() {
        return this._engine;
    }

    get globals() {
        return this._globals;
    }

    get env() {
        return this._env;
    }

    setGlobal(path, value) {
        _.set(this._globals, path, value);
        return this;
    }

    render(path, context) {
        lastError = null;
        this._engine.addGlobal('frctl', this._globals);
        return this._engine.renderAsync(path, context || {});
    }

    renderString(str, context) {
        lastError = null;
        this._engine.addGlobal('frctl', this._globals);
        return this._engine.renderStringAsync(str, context || {});
    }

};
