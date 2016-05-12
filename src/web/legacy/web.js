'use strict';

const Path        = require('path');
const _           = require('lodash');
const defaults    = require('../config');
const server      = require('./server');
const build       = require('./build');
const packageJSON = require('../package.json');

module.exports = function (config, app) {

    const console = app.console;
    // const ports   = new Set();
    const servers = new Set();

    this.name     = 'web';
    this.title    = 'Fractal web preview';
    this.version  = packageJSON.version;

    this.command('start', {
        description: 'Start the web UI preview server',
        options: [
            ['-p, --port <number>', `The port to run the server on. Defaults to ${config.port}`],
            ['-t, --theme <package-name>', 'The name of custom UI theme to use, if required'],
            ['-s, --sync', 'Use BrowserSync to sync and reload pages when changes occur'],
            ['-w, --watch', 'Watch the filesystem for changes.']
        ]
    }, (args, done) => {
        app.emit('web:server:start');
        console.notice('Starting preview server...');
        const mergedConfig = mergeConfig(args.options, this.config);
        const theme = loadTheme(mergedConfig);
        if (mergedConfig.watch || mergedConfig.sync) {
            app.watch();
        }
        server(mergedConfig, theme, app).then(function(srv){
            servers.add(srv);
            srv.start(done);
        });
    });

    this.command('stop', {
        description: 'Stop all running servers'
    }, (args, done) => {
        let runningCount = servers.size;
        if (!runningCount) {
            console.notice('There are currently no servers running.');
            done();
            return;
        }
        for (let server of servers.values()) {
            server.stop(function(){
                runningCount--;
                if (runningCount === 0) {
                    servers.clear();
                    app.emit('web:server:end');
                    done();
                }
            });
        }
    });

    this.command('build', {
        description: 'Build a static version of the web UI',
        options: [
            ['-t, --theme <package-name>', 'The custom UI theme to use, if required.']
        ]
    }, (args, done) => {
        console.notice('Starting static web build...');
        app.emit('web:build:start');
        const mergedConfig = mergeConfig(args.options, this.config);
        const theme = loadTheme(mergedConfig);
        if (!theme.hasBuilder()) {
            console.error(`The theme '${theme.name}' does not provide a build option.`);
            return;
        }
        build(mergedConfig, theme, app).then(() => {
            console.success('Static web build finished');
            app.emit('build:end');
            done();
        }).catch(e => {
            console.error(e);
            app.emit('web:build:end');
            done();
        });
    });

    function loadTheme(config) {

        const theme     = require('./theme')();
        const themeName = config.theme;
        const instance = _.isString(themeName) ? require(themeName) : themeName;

        instance.bind(theme)();

        if (!theme.name) {
            throw new Error('Theme must specify a \'name\' attribute.');
        }

        theme.config(_.clone(app.get(`themes.${theme.name}`)));

        if (config.static.path) {
            theme.static(config.static.path, config.static.mount);
        }
        if (config.favicon) {
            theme.favicon(_.trim(config.favicon, '/'));
        }
        theme.build = config.build.path;
        return theme;
    }

    function mergeConfig(args, config){
        return _.defaultsDeep(args, _.clone(config), defaults);
    }

};
