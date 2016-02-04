'use strict';

const Promise = require('bluebird');
const Path    = require('path');
const _       = require('lodash');
const fs      = Promise.promisifyAll(require('fs-extra'));
const request = require('./supertest');

module.exports = function(theme){

    const buildDir = Path.resolve(theme.buildDir());

    return {

        before(){
            return fs.removeAsync(buildDir).then(function(){
                return fs.ensureDirAsync(buildDir);
            });
        },

        after(){

        },

        addRoute(name, params){
            const url = theme.urlFromRoute(name, params);
            console.log(url);
        },

        copyStatic(source, dest){

            dest = _.trimEnd(Path.join(buildDir, dest), '/');
            source = Path.resolve(source);
            return fs.copyAsync(source, dest, {
                clobber: true
            });
        }
    }

};
