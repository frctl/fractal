'use strict';

const nunjucks    = require('nunjucks');
const _           = require('lodash');
const highlighter = require('./highlighter');

const filters     = new Map();
const globals     = new Map();
const extensions  = new Map();

const NullLoader = nunjucks.Loader.extend({
    getSource: name => {}
});

globals.set('utils', {
    highlight: highlighter
});

filters.set('async', {
    filter: (p, cb) => Promise.resolve(p).then(result => cb(null, result)).catch(cb),
    async: true
});

extensions.set('ErrorExtension', new ErrorExtension())

module.exports = function nunj(includePath, config){

    config = config || {};

    const loader = includePath ? new nunjucks.FileSystemLoader(includePath, {
        watch: false,
        noCache: true
    }) : new NullLoader();

    const env = new nunjucks.Environment(loader);
    const applyFilter = addFilter.bind(env);

    // Add Common
    globals.forEach((val, key) => env.addGlobal(key, val));
    filters.forEach(applyFilter);
    extensions.forEach((val, key) => env.addExtension(key, val));

    // Add configured
    _.each(config.globals || {}, (val, key) => env.addGlobal(key, val));
    _.each(config.filters || {}, applyFilter);
    _.each(config.extensions || {}, (val, key) => env.addExtension(key, val));

    return function(str, context){
        return env.renderString(str, context || {});
    };
};

function addFilter(val, key) {
    if (_.isFunction(val)) {
        return this.addFilter(key, val);
    }
    this.addFilter(key, val.filter, val.async || false);
}

function ErrorExtension() {
    this.tags = ['error'];
    this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
        var errorType = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        return new nodes.CallExtension(this, 'run', errorType);
    };
    this.run = function(context, errorType) {
        if (errorType == '404') {
            throw new NotFoundError('Not Found');
        } else {
            throw new Error('Server error');
        }
    };
}
