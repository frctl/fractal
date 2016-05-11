'use strict';

const Promise = require('bluebird');
const Path    = require('path');
const co      = require('co');
const builder = require('./builder');
const engine  = require('./render');

module.exports = function build(config, theme, app) {

    theme.rootPath = config.build.root;
    
    const console = app.console;
    const render  = engine(theme.views, config.engine, theme, app);

    if (!theme.build) {
        console.error('You need to specify a build destination in your configuration.');
        return;
    }
    theme.static().forEach(stat => {
        if (stat.path == theme.build) {
            console.error(`Your build destination directory (${Path.resolve(stat.path)}) cannot be the same as your static assets directory.`);
            process.exit(1);
        }
    });

    const bob = builder(config, theme, render, app);

    theme.builder(bob, app);
    return bob.run();

};
