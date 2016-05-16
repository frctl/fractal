/*

 * themes, engines, plugins etc should be provide a configuration interface for themselves. Fractal global config is not for these.
 * multiple themes and engines can be 'registered'. Settings theen define which one to use as a default.


 */

const fractal = require('@frctl/fractal')();



const engine = fractal.components.engine();

// CORE ----------------------------------

const fhbs    = require('@frctl/handlebars-adapter');
const handlebarsAdapter = fhbs({
    useHelpers: true,
});

// handlebarsAdapter.engine.registerPartial('doo')

fractal.engine(handlebarsAdapter); // register an engine to use for a specific extension

// const adapter = fractal.components.engine();
//
// fractal.components.set({
//
// });
//
// fractal.components.load();

// fractal.sources().components;

// CLI ----------------------------------

fractal.cli.theme('my-cli-theme');

fractal.cli.set('theme', 'my-cli-theme');

fractal.cli.command('foo-command', function(){
    // do something
});

fractal.cli.exec('foo --blah');

fractal.cli.log('this is a messsage');
fractal.cli.error('this is a messsage');

// WEB ----------------------------------

const mandelbrot = require('@frctl/mandelbrot');

const myTheme = mandelbrot({
    skin: 'blue'
});

fractal.web.theme('mandelbrot', myTheme);

fractal.web.set('server.port', '');
fractal.web.set('server.sync', true);

fractal.web.set('builder.path', 'build');
fractal.web.set('builder.root', true);

const server2 = fractal.web.server({
    port: 1000,
    theme: myTheme,
    sync: {

    }
});

server2.start(true);
//
server2.stop();

fractal.web.builder(config).start();

// API ----------------------------------

fractal.config.set();
