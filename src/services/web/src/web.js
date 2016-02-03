'use strict';

const Path        = require('path');
const defaults    = require('../config');
const server      = require('./server');
const build       = require('./build');
const theme       = require('./theme');
const packageJSON = require('../package.json');

module.exports = function(service){

    service.name('web');
    service.title('Fractal web preview');
    service.version(packageJSON.version);

    service.defaults(defaults);

    service.register(service.name(), 'Start a local web server or generate a static build.', (yargs) => {

        yargs.usage(`\nUsage: $0 ${service.name()} <command>`);

        yargs.command('start', 'Start the component library web interface server.', (yargs) => {
            yargs.usage('\nUsage: $0 start [options]');
            yargs.option('p', {
                alias: 'port',
                default: service.config('port'),
                description: 'The port to run the server on.',
            });
            service.wrap(yargs, 2);
        });

        yargs.command('build', 'Generate a static version of the component library web interface.', (yargs) => {
            yargs.usage('\nUsage: $0 build');
            service.wrap(yargs, 2);
        });

        service.wrap(yargs, 2);
    });

    service.runner(function(command, args, opts, app){
        console.log(service.config('port'));
        service.config('port', opts.port || service.config('port'));
        app.theme = loadTheme();
        if (command === service.name()) {
            if (args[0] === 'start') {
                const srv = server(service.config(), app);
                return srv.start();
            } else if (args[0] === 'build') {
                return build(service.config(), app);
            }
        }
        throw new Error('Command not recognised');
    });

    function loadTheme(){
        theme.root(Path.parse(require.resolve(service.config('theme'))).dir);
        require(service.config('theme'))(theme);
        if (service.config('static.path')) {
            theme.static(service.config('static.path'), service.config('static.mount'));
        }
        if (service.config('favicon')) {
            theme.favicon(service.config('favicon'));
        }
        return theme;
    }

};
