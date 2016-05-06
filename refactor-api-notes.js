/*

 *


 */

const fractal = require('@frctl/fractal');

// CORE ----------------------------------

const handlebars = require('handlebars');
const adapter    = require('@frctl/handlebars-adapter').create();

adapter.set('engine', handlebars);
adapter.set('extension', '.hbs');


fractal.components.engine(adapter);

fractal.engine(handlebars);


// CLI ----------------------------------

fractal.cli.theme('my-theme');

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
