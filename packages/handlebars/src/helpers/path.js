'use strict';

const Handlebars = require('handlebars');
const _          = require('lodash');
const Path       = require('path');

module.exports = function(fractal){

    return function staticPath(str, root){
        root = this._config ? this : root;

        if (! root || ! root._env || root._env.server || str.startsWith('http') || str.startsWith('.')) {
            return str;
        }

        const currentPath = getStaticPagePath(_.get(root._request, 'path', '/'));
        let url = '/' + _.trim(Path.extname(str) ? str : getStaticPagePath(str), '/');
        return Path.relative(currentPath, url).replace(/^\.\.\//,'');
    };

};

function getStaticPagePath(url) {
    if (url == '/') {
        return '/index.html'
    }
    const parts = Path.parse(url);
    return Path.join(parts.dir, parts.name + '.html');
}
