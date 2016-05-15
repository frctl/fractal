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
            const currentPath = _.get(frctl, 'web.request.path', '/');
            const url = Path.extname(str) ? str : getStaticPagePath(str);
            return _.trimStart(Path.relative(getStaticPagePath(currentPath), url), ['/']).replace(/^\.\.\//,'');
        }
    }

};

function getStaticPagePath(url) {
    if (url == '/') {
        return '/index.html'
    }
    const parts = Path.parse(url);
    return Path.join(parts.dir, parts.name + '.html');
}
