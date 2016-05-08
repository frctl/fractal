/*

 *


 */

const fractal = require('@frctl/fractal');

// CORE ----------------------------------

const handlebars = require('handlebars');
const adapter    = require('@frctl/handlebars-adapter').create();

adapter.set('engine', handlebars);
adapter.set('extension', '.hbs');

fractal.engine(handlebars);

const adapter = fractal.components.engine();

fractal.config.set()


// CLI ----------------------------------

fractal.cli.theme('my-cli-theme');

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

const server1 = fractal.web.start({
    port: 1000,
    theme: mandelbrot
});

server2.stop();


// API ----------------------------------

fractal.config.set();
