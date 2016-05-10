/*

 * themes, engines, plugins etc should be provide a configuration interface for themselves. Fractal global config is not for these.
 * multiple themes and engines can be 'registered'. Settings theen define which one to use as a default.


 */

const fractal = require('@frctl/fractal');

const engine = fractal.components.engine();

// CORE ----------------------------------

const fhbs    = require('@frctl/handlebars-adapter');
const handlebarsAdapter = fhbs({
    useHelpers: true
});

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
mandelbrot.config({
    foo: 'bar'
});

fractal.web.theme(mandelbrot);

fractal.web.start();

const server2 = fractal.web.start({
    port: 1000,
    theme: mandelbrot
});

server2.stop();

fractal.web.build(config);

// API ----------------------------------

fractal.config.set();
