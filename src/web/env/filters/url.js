'use strict';

const _         = require('lodash');
const Path      = require('path');

module.exports = function(app, env) {

    return {
        name: 'url',
        filter(str) {
            const frctl = this.env.getGlobal('frctl');
            if (_.get(frctl, 'web.server')) {
                return str;
            }
            const urlPath = _.get(frctl, 'web.request.path', '/');
            const suffix = str.indexOf('.') === -1 ? '/index.html' : '';
            return _.trimStart(Path.join(Path.relative(urlPath, str), suffix), '/');
        }
    }

};
