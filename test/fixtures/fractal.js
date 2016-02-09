const fractal = require('../../.');

fractal.set('components.path', 'src/components/hbs');

const pages = fractal.source('pages');
const components = fractal.source('components');

fractal.command('test', function(app){

    fractal.load().then(function(source){
        console.log('Promise resolved');
    }).catch(e => console.log(e));
    fractal.watch();
});

function list(source){
    console.log('-----');
    for (item of source.flatten(true)) {
        console.log(item.handle);
    }
}

components.on('changed', function(source){
    list(source);
});

components.on('loaded', function(source){
    list(source);
});
