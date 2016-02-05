'use strict';

const Path        = require('path');
const defaults    = require('../config');
const server      = require('./server');
const build       = require('./build');
const theme       = require('./theme');
const packageJSON = require('../package.json');

module.exports = function (plugin) {

    plugin.name('web');
    plugin.title('Fractal web preview');
    plugin.version(packageJSON.version);

    plugin.defaults(defaults);

    plugin.register('start', 'Start the Fractal web interface server.', (yargs) => {
        yargs.usage('\nUsage: $0 start [options]');
        yargs.option('p', {
            alias: 'port',
            default: plugin.config('port'),
            description: 'The port to run the server on.',
        });
        plugin.wrap(yargs, 1);
    });

    plugin.register('build', 'Generate a static version of the Fractal web interface.', (yargs) => {
        yargs.command('build', 'Generate a static version of the component library web interface.', (yargs) => {
            yargs.usage('\nUsage: $0 build');
            plugin.wrap(yargs, 1);
        });
    });

    plugin.runner(function (command, args, opts, app) {
        plugin.config('port', opts.port || plugin.config('port'));
        app.theme = loadTheme();
        if (command === 'start') {
            const srv = server(plugin.config(), app);
            return srv.start();
        } else if (command === 'build') {
            return build(plugin.config(), app);
        }
        throw new Error('Command not recognised');
    });

    function loadTheme() {
        theme.root(Path.parse(require.resolve(plugin.config('theme'))).dir);
        require(plugin.config('theme'))(theme);
        if (plugin.config('static.path')) {
            theme.static(plugin.config('static.path'), plugin.config('static.mount'));
        }
        if (plugin.config('favicon')) {
            theme.favicon(_.trim(plugin.config('favicon'), '/'));
        }
        theme.buildDir(plugin.config('build.dest'));
        return theme;
    }

};
