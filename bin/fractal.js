#!/usr/bin/env node

'use strict';

const Path = require('path');
const Liftoff = require('liftoff');

const FractalCli = new Liftoff({
    processTitle: 'fractal',
    moduleName: 'fractal-fork',
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

FractalCli.prepare(config, function (env) {
    let app;
    let configPath = env.configPath;

    if (!configPath) {
        console.error('Please specify a configPath for your project context');
        return;
    }

    try {
        app = require(configPath);
    } catch (e) {
        console.error(e.stack);
        return;
    }

    /*
     * Check that the config file is correctly exporting a configured fractal instance.
     */

    if (!app || !app.__fractal) {
        // looks like the configuration file is not correctly module.export'ing a fractal instance
        console.error(
            `Configuration error: The CLI configuration file is not exporting an instance of Fractal.`
        );
        return;
    }

    if (Path.basename(configPath) === 'fractal.js') {
        console.log(`Deprecated configuration file name! Rename fractal.js to fractal.config.js.`);
    }

    /*
     * Kick things off...
     */

    app.cli.init(configPath);
    app.cli.exec();
});
