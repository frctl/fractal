'use strict';

const Promise  = require('bluebird');
const md       = require('../markdown');
const config   = require('../config');
const nunjucks = require('../nunjucks');

module.exports = function(page){
    var render = nunjucks();
    return Promise.resolve(md(render(page.content, page.context)));
};
