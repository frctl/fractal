'use strict';

const Promise     = require('bluebird');
const nunjucks    = require('nunjucks');
const _           = require('lodash');
const highlighter = require('./highlighter');
const Component   = require('./components/component');
const Variant     = require('./components/variant');
const Page        = require('./pages/page');
const context     = require('./components/context');
const status      = require('./components/status');
const app         = require('./app');
const logger      = require('./logger');

const NullLoader = nunjucks.Loader.extend({
    getSource: name => {}
});

module.exports = function (includePath, config) {

    config = config || {};

    const loader = includePath ? new nunjucks.FileSystemLoader(includePath, {
        watch: false,
        noCache: true
    }) : new NullLoader();

    const env = Promise.promisifyAll(new nunjucks.Environment(loader, {
        autoescape: false,
        noCache: true
    }));

    // Add configured
    _.each(_.defaults(config.globals || {}),    (val, key) => env.addGlobal(key, val));
    _.each(_.defaults(config.extensions || {}), (val, key) => env.addExtension(key, val));
    _.each(_.defaults(config.filters || {}),    (val, key) => {
        return _.isFunction(val) ? env.addFilter(key, val) : env.addFilter(key, val.filter, val.async || false);
    });

    env.addFilter('context', (entity, cb) => {
        let ctx;
        if (entity instanceof Component || entity instanceof Variant) {
            ctx = context(entity.context);
        } else if (entity instanceof Page) {
            ctx = Promise.resolve(entity.context);
        } else {
            ctx = Promise.resolve(entity);
        }
        ctx.then(result => cb(null, result)).catch(cb);
    }, true);

    env.addFilter('render', (entity, cb) => {
        let rendered;
        if (entity instanceof Variant || entity instanceof Component) {
            rendered = require('./components/render')(entity);
        } else if (entity instanceof Page) {
            rendered = require('./pages/render')(entity);
        }
        rendered.then(result => cb(null, result)).catch(cb);
    }, true);

    env.addFilter('preview', (entity, cb) => {
        render(entity, true).then(result => cb(null, result)).catch(cb);
    }, true);

    env.addFilter('async', (p, cb) => {
        Promise.resolve(p).then(result => cb(null, result)).catch(cb);
    }, true);

    env.addFilter('stringify', (obj) => {
        return JSON.stringify(obj, null, 4);
    });

    env.addFilter('status', (entity) => {
        return status(entity.status);
    });

    env.addFilter('highlight', highlighter);

    env.addExtension('Throw404Extension', new Throw404Extension());

    return {
        env: env,
        string: function (str, context, globals) {
            return Promise.props(app()).then(app => {
                env.addGlobal('frctl', Object.assign(app, globals || {}));
                return env.renderStringAsync(str, context || {});
            });
        },
        template: function (path, context, globals) {
            return Promise.props(app()).then(app => {
                env.addGlobal('frctl', Object.assign(app, globals || {}));
                return env.renderAsync(path, context || {});
            });
        }
    };
};

function Throw404Extension() {
    this.tags = ['throw404'];
    this.parse = function (parser, nodes, lexer) {
        var tok = parser.nextToken();
        var message = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        return new nodes.CallExtension(this, 'run', message);
    };
    this.run = function (context, message) {
        throw new Error(message || 'Not Found');
    };
}
