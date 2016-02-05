'use strict';

const Promise = require('bluebird');
const Path    = require('path');
const co      = require('co');
const _       = require('lodash');
const fs      = Promise.promisifyAll(require('fs-extra'));
const mkdirp  = Promise.promisify(require('mkdirp'));
const request = require('./supertest');
const throat  = require('throat')(require('bluebird'))(5);

module.exports = function(theme, server){

    const buildDir = Path.resolve(theme.buildDir());
    const urls     = [];

    const setup = co.wrap(function* (){
        yield fs.removeAsync(buildDir)
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

        setup(func){
            if (!_.isFunction(func) || !_.isNull(func)) {
                setup = func;
            } else {
                throw new Error('Invalid setup method provided');
            }
        },

        run(){
            const req = request(server);
            return setup().then(function(){
                const jobs = [];
                _.forEach(urls, function(url){
                    const savePath = Path.join(buildDir, url, 'index.html');
                    const pathInfo = Path.parse(savePath);
                    const job = throat(function(){
                        return mkdirp(pathInfo.dir).then(function(){
                            return req.get('/').end().then(function(response){
                                return fs.writeFileAsync(savePath, response.text);
                            });
                        });
                    });
                    jobs.push(job);
                });

                return Promise.all(jobs).then(function(){
                    process.exit();
                }).catch(function(err){
                    console.log(err);
                    process.exit();
                });
            });
        },

        requestRoute(name, params){
            const url = theme.urlFromRoute(name, params);
            urls.push(url);
        },

        requestUrl(url){
            //TODO: some checking of validity here
            urls.push(url);
        },

        copyStatic: copyStatic
    }

};
