'use strict';

const Promise  = require('bluebird');
const _        = require('lodash');
const md       = require('../markdown');
const nunjucks = require('../nunjucks');
const render   = nunjucks();

module.exports = function (page) {
    return Promise.resolve(render(page.content, page.context).then(c => md(c)));
};
