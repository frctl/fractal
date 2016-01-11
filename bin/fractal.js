'use strict';

/*
 * Load dependencies.
 */

var chalk   = require('chalk');
var semver  = require('semver');
var Liftoff = require('liftoff');
var logger  = require('winston');
var yargs   = require('yargs');

var cliPackage = require('../package.json');

var argv, levelOpt;

/*
 * Define global options
 */

yargs.usage('\nUsage: $0 <command> [options]');

yargs.version(cliPackage.version);

function addShared(yargs){
    yargs.option('l', {
        alias: 'level',
        default: 'warn',
        description: 'The log level to use.',
        type: 'string',
        choices: ['error','warn','info','verbose','debug','silly'],
    });
    yargs.alias('h', 'help').help('help').wrap(false);
    return yargs;
};

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
    argv = addShared(yargs).argv;
    checkCommandCount(yargs, argv, 1);
});

/*
 * Define `build` command
 */

yargs.command('build', 'Generate a static version of your component library.', function (yargs, argv) {
    yargs.usage('\nUsage: $0 build');
    argv = addShared(yargs).argv;
    checkCommandCount(yargs, argv, 1);
});

/*
 * Define `init` command
 */

yargs.command('init', 'Initialise a new Fractal project in the current directory.', function (yargs, argv) {
    yargs.usage('\nUsage: $0 init');
    argv = addShared(yargs).argv;
    checkCommandCount(yargs, argv, 1);
});

/*
 * Define `create` command
 */

yargs.command('create', 'Create a new page or component. See command help for details.', function (yargs, argv) {
    yargs.usage('\nUsage: $0 create <item>');

    /*
     * Define component creation command
     */

    yargs.command('component', 'Create a new empty component', function (yargs) {
        yargs.usage('\nUsage: $0 create component <path>');
        argv = addShared(yargs).argv;
        checkCommandCount(yargs, argv, 3);
    });

    /*
     * Define page creation command
     */

    yargs.command('page', 'Create a new blank page', function (yargs) {
        yargs.usage('\nUsage: $0 create page <path>');
        // yargs.example('$0 create page styleguide/images', 'Create a new page');
        argv = addShared(yargs).argv;
        checkCommandCount(yargs, argv, 3);
    });

    argv = addShared(yargs).updateStrings({
        'Commands:': 'Items:'
    }).argv;

    checkCommandCount(yargs, argv, 2);
});

/*
 * Configure liftoff to enable us to find the local Fractal module.
 */

var Fractal = new Liftoff({
    processTitle: 'fractal',
    moduleName: '@frctl/fractal',
    configName: 'fractal',
});

/*
 * Run tings proper.
 */

argv = addShared(yargs).argv;

checkCommandCount(yargs, argv, 1);

 Fractal.launch({
    argv: argv
 }, run);

 function run(env){

    logger.cli();

    if (!env.modulePath) {
        logger.error("Local fractal module not found in %s \n\t Try running: npm install @frctl/fractal", env.cwd);
        process.exit(1);
    }

    if (!env.configPath) {
        logger.error('No fractal.js file found.');
        process.exit(1);
    }

    if (semver.gt(cliPackage.version, env.modulePackage.version)) {
        logger.warn(
            "Fractal version mismatch:\n\t Global fractal is %s\n\t Local fractal is %s",
            cliPackage.version,
            env.modulePackage.version
        );
    }

    require(env.configPath);
    var app = require(env.modulePath);

    if (argv.level) {
        app.set('log:level', argv.level);
        logger.level = app.get('log:level');
    }

    logger.info('Using config file %s', env.configPath);

    app.run(argv);
}

function checkCommandCount(yargs, argv, numRequired) {
    if (argv._.length < numRequired) {
        yargs.showHelp();
        process.exit(1);
        return false;
    }
    return true;
}
