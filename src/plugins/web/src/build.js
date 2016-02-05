'use strict';

const Promise = require('bluebird');
const Path    = require('path');
const co      = require('co');
const builder = require('./builder');

module.exports = function build(config, app) {

    const theme  = app.theme;
    const log    = app.log;
    const render = app.render(theme.views());

    if (!theme.buildDir()) {
        log.error('You need to specify a build destination in your configuration.');
        process.exit(1);
        return;
    }
    theme.static().forEach(stat => {
        if (stat.path == theme.buildDir()) {
            log.error(`Your build destination directory (${Path.resolve(stat.path)}) cannot be the same as your static assets directory.`);
            process.exit(1);
        }
    });

    const bob = builder(theme, render, config.build.concurrency);

    co(function* () {
        log.started('Starting static web build');
        const api = yield app();
        theme.builder()(bob, api);
        yield bob.run();
        log.taskSuccess('Static web build finished');
        process.exit();
    }).catch(err => {
        log.error(err);
        process.exit(1);
    });

};
