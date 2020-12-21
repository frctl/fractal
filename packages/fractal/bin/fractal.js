#!/usr/bin/env node

'use strict';

const Path = require('path');
const semver = require('semver');
const Liftoff = require('liftoff');
const chalk = require('chalk');
const updateNofifier = require('update-notifier');
const cliPackage = require('../package.json');

const notifier = updateNofifier({
    pkg: cliPackage,
});

const FractalCli = new Liftoff({
    processTitle: 'fractal',
    moduleName: '@frctl/fractal',
    configName: 'fractal',
    extensions: {
        '.config.js': null,
        '.js': null,
    },
    // ,
    // v8flags: ['--harmony']
});

/*
 * Figure out what the Fractal CLI config file is called.
 *
 * - See if there is a package.json file present that contains a specific filename
 * - Otherwise look for the default fractal.config.js or fractal.js
 */

let config = {};
try {
    const projectPackage = require(Path.join(process.cwd(), 'package.json'));
    if (projectPackage.fractal && projectPackage.fractal.main) {
        config.configPath = Path.join(process.cwd(), projectPackage.fractal.main);
    }
} catch (e) {
    // don't do anything with the error since not having a package.json
    // is expected when it can't be required
}

FractalCli.launch(config, function (env) {
    let app;
    let scope = 'global';
    let configPath = env.configPath;

    if (configPath) {
        // Config file found - it's running in project context.
        try {
            app = require(configPath);
            scope = 'project';
        } catch (e) {
            console.error(e.stack);
            return;
        }
    }

    /*
     * If it's a project context check compare the local Fractal version with the CLI version.
     * Also check that the config file is correctly exporting a configured fractal instance.
     *
     * If it's not a global context, then import the global Fractal module and create a fresh instance.
     */

    if (scope === 'project') {
        if (semver.lt(env.modulePackage.version, `1.0.0`)) {
            // Project is using a legacy version of Fractal, load it the old way...
            console.log(
                `Fractal version mismatch! Global: ${cliPackage.version} / Local: ${env.modulePackage.version}`
            );
            let frctl = require(env.modulePath);
            frctl.run();
            return;
        }

        if (!app || !app.__fractal) {
            // looks like the configuration file is not correctly module.export'ing a fractal instance
            console.log(
                `${chalk.red(
                    'Configuration error'
                )}: The CLI configuration file is not exporting an instance of Fractal.`
            );
            return;
        }

        // Alert to any version mismatches.
        if (semver.gt(cliPackage.version, env.modulePackage.version)) {
            app.cli.notify.versionMismatch({
                cli: cliPackage.version,
                local: env.modulePackage.version,
            });
        }

        if (Path.basename(configPath) === 'fractal.js') {
            console.log(`Deprecated configuration file name! Rename fractal.js to fractal.config.js.`);
        }
    } else {
        // Global context
        app = require('../.').create();
    }

    /*
     * Notify of any available updates on exit
     */

    if (notifier.update) {
        process.on('exit', function () {
            app.cli.notify.updateAvailable(notifier.update);
        });
    }

    /*
     * Kick things off...
     */

    app.cli.init(scope, configPath, env, cliPackage);
    app.cli.exec();
});
