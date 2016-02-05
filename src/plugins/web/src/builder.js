'use strict';

const Promise = require('bluebird');
const Path    = require('path');
const co      = require('co');
const _       = require('lodash');
const fs      = Promise.promisifyAll(require('fs-extra'));
const request = require('./supertest');

module.exports = function (theme, render, concurrency) {

    const buildDir = Path.resolve(theme.buildDir());
    const throat  = require('throat')(Promise)(5);
    const targets = [];

    const setup = co.wrap(function* () {
        yield fs.removeAsync(buildDir);
        yield fs.ensureDirAsync(buildDir);
        yield theme.static().map(p => copyStatic(p.path, p.mount));
    });

    function copyStatic(source, dest) {
        dest = _.trimEnd(Path.join(buildDir, dest), '/');
        source = Path.resolve(source);
        return fs.copyAsync(source, dest, {
            clobber: true
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
                                    theme: theme,
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
                                return fs.writeFileAsync(savePath, html);
                            });
                        });
                    });
                    jobs.push(job);
                }

                return Promise.all(jobs);
            });
        },

        addRoute(name, params) {
            const url = theme.urlFromRoute(name, params);
            const route = theme.matchRoute(url);
            route.url = url;
            if (route) {
                targets.push(route);
            }
        },

        copyStatic: copyStatic
    };

};
