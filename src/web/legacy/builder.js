'use strict';

const Promise = require('bluebird');
const Path    = require('path');
const co      = require('co');
const _       = require('lodash');
const fs      = Promise.promisifyAll(require('fs-extra'));

module.exports = function (config, theme, render, app) {

    const console  = app.console;
    const buildDir = Path.resolve(theme.build);
    const throat   = require('throat')(Promise)(config.build.concurrency);
    const targets  = [];

    let setup = function () {
        return fs.removeAsync(buildDir).then(() => {
            return fs.ensureDirAsync(buildDir).then(() => {
                return theme.static().map(p => copyStatic(p.path, p.mount));
            });
        });
    };

    function copyStatic(source, dest) {
        dest = _.trimEnd(Path.join(buildDir, dest), '/');
        source = Path.resolve(source);
        return fs.copyAsync(source, dest, {
            clobber: true
        }).catch(function(err){
            console.error(err);
        });
    }

    return {

        setup(func) {
            if (!_.isFunction(func) || !_.isNull(func)) {
                setup = func;
            } else {
                throw new Error('Invalid setup method provided');
            }
        },

        run() {
            return setup().then(function () {
                const jobs = [];
                for (let target of targets) {
                    const savePath = Path.join(buildDir, target.url, 'index.html');
                    const pathInfo = Path.parse(savePath);
                    const job = throat(function () {
                        return fs.ensureDirAsync(pathInfo.dir).then(function () {
                            return render.template(target.route.view, target.route.context, {
                                web: {
                                    request: {
                                        isPjax: false,
                                        segments: _.compact(target.url.split('/')),
                                        params: target.params,
                                        path: target.url,
                                        error: null,
                                        errorStatus: null,
                                        route: target.route,
                                    }
                                }
                            }).then(function (html) {
                                return fs.writeFileAsync(savePath, html).then(() => {
                                    console.debug(`Saved ${target.url} to ${savePath}`);
                                }).catch(e => {
                                    console.error(`Failed to export url ${target.url} - ${e.message}`);
                                });
                            }).catch(e => {
                                console.error(`Failed to export url ${target.url} - ${e.message}`);
                            });
                        }).catch(e => {
                            console.error(`Failed to export url ${target.url} - ${e.message}`);
                        });
                    });
                    jobs.push(job);
                }

                return Promise.all(jobs);
            });
        },

        addRoute(name, params) {
            const url = theme.urlFromRoute(name, params, true);
            const route = _.clone(theme.matchRoute(url));
            route.url = url;
            if (route) {
                targets.push(route);
            }
        },

        copyStatic: copyStatic
    };

};
