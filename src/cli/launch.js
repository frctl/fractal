'use strict';

/*
 * Load dependencies.
 */

var chalk   = require('chalk');
var semver  = require('semver');
var Liftoff = require('liftoff');
var logger  = require('winston');

/*
 * Configure liftoff to enable us to find the local Fractal module.
 */

var Fractal = new Liftoff({
    processTitle: 'fractal',
    moduleName: '@frctl/fractal',
    configName: 'fractal',
});

/*
 * Fetch package.json ready for inspection.
 */

var cliPackage = require('../../package.json');

module.exports = function(command, input){

    Fractal.launch({
        argv: input
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

        if (input.level) {
            app.set('log:level', input.level);
            logger.level = app.get('log:level');
        }

        logger.info('Using config file %s', env.configPath);

        app.run(command);

    }

};

/*
 * Run tings proper.
 */
