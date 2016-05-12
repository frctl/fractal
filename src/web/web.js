'use strict';

const _            = require('lodash');
const mix          = require('../core/mixins/mix');
const Configurable = require('../core/mixins/configurable');
const Emitter      = require('../core/mixins/emitter');
const Server       = require('./server');
const Builder      = require('./server');
const Theme        = require('./theme');

module.exports = class Web extends mix(Configurable, Emitter) {

    constructor(app){
        super(app);
        this.config(app.get('web'));
        this._app          = app;
        this._servers      = new Map();
        this._themes       = new Map();
        // this._defaultTheme = '@frctl/mandelbrot';
        this._defaultTheme = require('./themes/test')();
    }

    server(config) {
        let merged   = _.defaultsDeep(config, this.get('server'));
        const theme  = this._loadTheme(merged.theme);
        const server = new Server(theme, merged, this._app);
        return server;
    }

    builder(config) {
        let merged    = _.defaultsDeep(config, this.get('builder'));
        const theme   = this._loadTheme(merged.theme);
        const builder = new Builder(theme, merged, this._app);
        return builder;
    }

    theme(name, instance) {
        instance = instance || require(name)();
        this._themes.set(name, instance);
        this._defaultTheme = name;
        return this;
    }

    _loadTheme(theme){
        if (!theme) {
            theme = this._defaultTheme;
        }
        if (_.isString(theme)) {
            if (this._themes.has(theme)) {
                theme = this._themes.get(theme);
            } else {
                theme = require(theme)();
            }
        }
        if (!theme instanceof Theme) {
            throw new Error('Fractal themes must inherit from the base Theme class.');
        }
        return theme;
    }
}
