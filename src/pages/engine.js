'use strict';

const Promise  = require('bluebird');
const md       = require('../markdown');
const config   = require('../config');
const nunjucks = require('../nunjucks');

module.exports = function(str, context){
    var render = nunjucks();
    return Promise.resolve(md(render(str, context)));
};
