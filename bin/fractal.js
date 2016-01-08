var input   = require('commander');

var cliPackage = require('../package.json');

input
    .version(cliPackage.version)
    .usage('<command> [options]')
    // .noHelp(true)
    .option('-l, --level <level>', 'The log level to use [error|warn|info|verbose|debug|silly]', /^(error|warn|info|verbose|debug|silly)$/i, 'warn');


input.command('start', 'Start the fractal server.');

    // .description()
    // .option('-p, --port <port>', 'The port for the server to listen on')
    // .action(function(cmd) {
    //     command = cmd;
    // });
//
// input
//     .command('build')
//     .description('Generate a static version of your component library.')
//     .action(function(cmd) {
//         command = cmd;
//     });
//
// input
//     .command('create:component <path>', 'Create a new empty component at the specified path.')
//     .action(function (type, path, cmd) {
//         command = cmd;
//         command.namedArgs = {
//             'path': path,
//         };
//     })
//     .command('create:page <path>', 'Create a new empty page at the specified path.')
//     .action(function (type, path, cmd) {
//         command = cmd;
//         command.namedArgs = {
//             'path': path,
//         };
//     });
//
// input
//     .command('init')
//     .description('Initialise a new Fractal project in the current working directory.')
//     .action(function(cmd) {
//         command = cmd;
//     });

input.parse(process.argv);

// if (!command) {
//     input.help();
// }
