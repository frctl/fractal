'use strict';

const Promise     = require('bluebird');
const Path        = require('path');
const nunjucks    = require('nunjucks');
const yaml        = require('js-yaml');
const _           = require('lodash');
const requireAll  = require('require-all');
const extensions  = requireAll(`${__dirname}/extensions`);
const filters     = requireAll(`${__dirname}/filters`);

module.exports = class Env {

    constructor(viewsPath, app){

        this._app = app;
        viewsPath = [].concat(viewsPath);

        const views = viewsPath.concat([
            Path.join(__dirname, '../../../views/web'),
        ]);

        const loader = new nunjucks.FileSystemLoader(views, {
            watch: false,
            noCache: true
        });

        this._engine = Promise.promisifyAll(new nunjucks.Environment(loader, {
            autoescape: false
        }));

        _.forEach(extensions, factory => {
            const e = factory(app, this._engine);
            this._engine.addExtension(e.name, new e.extension());
        });

        _.forEach(filters, factory => {
            const f = factory(app, this._engine);
            this._engine.addFilter(f.name, f.filter, f.async);
        });

        this._globals = {
            components: app.components,
            docs: app.docs,
            config: app.config(),
            web: {}
        };
    }

    get engine(){
        return this._engine;
    }

    setGlobal(path, value) {
        _.set(this._globals, path, value);
        return this;
    }

    render(path, context) {
        this._engine.addGlobal('frctl', this._globals);
        return this._engine.renderAsync(path, context || {});
    }

    renderString(str, context) {
        this._engine.addGlobal('frctl', this._globals);
        return this._engine.renderStringAsync(str, context || {});
    }

}
