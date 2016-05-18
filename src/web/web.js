'use strict';

const _            = require('lodash');
const mix          = require('../core/mixins/mix');
const Configurable = require('../core/mixins/configurable');
const Emitter      = require('../core/mixins/emitter');
const Server       = require('./server');
const Builder      = require('./builder');
const Theme        = require('./theme');
const Engine       = require('./engine');

module.exports = class Web extends mix(Configurable, Emitter) {

    constructor(app){
        super(app);
        this.config(app.get('web'));
        this._app          = app;
        this._servers      = new Map();
        this._themes       = new Map();
        this._defaultTheme = '@frctl/mandelbrot';
        // this._defaultTheme = require('./themes/test')();
    }

    server(config) {
        let opts = _.defaultsDeep(config, this.get('server'));
        const theme  = this._loadTheme(opts.theme, 'server');
        return new Server(theme, opts, this._app);
    }

    builder(config) {
        let opts = _.defaultsDeep(config, this.get('builder'));
        const theme = this._loadTheme(opts.theme, 'builder');
        return new Builder(theme, opts, this._app);
    }

    theme(name, instance) {
        instance = instance || require(name)();
        this._themes.set(name, instance);
        this._defaultTheme = name;
        return this;
    }

    _init(defaults) {
        let opts = _.defaultsDeep(config, defaults);
        const theme = this._loadTheme(opts.theme);
    }

    _loadTheme(theme, env){
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
        const stat = [].concat(this.get('static'));
        for (let s of stat) {
            if (s.path) {
                theme.static(s.path, s.mount || '/');
            }
        }
        theme.init(new Engine(theme.loadPaths(), env, this._app));
        return theme;
    }
}
