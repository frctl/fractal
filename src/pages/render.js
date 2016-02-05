'use strict';

const Promise  = require('bluebird');
const _        = require('lodash');
const md       = require('../markdown');
const config   = require('../config');
const render   = require('../render')(null, config.get('pages.extend', {}));

module.exports = function (page) {
    return Promise.resolve(render.string(page.content, page.context).then(c => md(c)));
};
