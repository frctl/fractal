
module.exports = function(yargs, callback){

    /*
     * Define `start` command
     */

    yargs.command('start', 'Start the fractal server.', function (yargs, argv) {
        yargs.usage('\nUsage: $0 start [options]');
        yargs.option('p', {
            alias: 'port',
            default: '3000',
            description: 'The port to run the server on.',
        });
        callback(yargs, argv, 1);
    });

    

};
