'use strict';

module.exports = function(){

    

};
//
// module.exports = function(){
//
//     yargs.usage('\nUsage: $0 <command> [subcommand] [options]');
//     yargs.version(this.version);
//
//     let argv = yargs.argv;
//
//     if (argv.level) {
//         this.set('log.level', argv.level);
//         logger.level = this.get('log.level');
//     }
//
//     const input = this._parseArgv(argv);
//     const use = plugins.get(input.command);
//     if (use) {
//         return use.runner()(input.command, input.args, input.opts, require('./app'));
//     }
//
//     yargs.showHelp();
//     process.exit(0);
//
// };
//
// _parseArgv(argv) {
//     const args = argv._;
//     const command = args.shift();
//     const opts = argv;
//     delete opts._;
//     delete opts.$0;
//     return {
//         command: command,
//         args: args,
//         opts: opts
//     };
// },
