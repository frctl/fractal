'use strict';

const Promise     = require('bluebird');
const nunjucks    = require('nunjucks');
const yaml        = require('js-yaml');
const _           = require('lodash');
const requireAll  = require('require-all');
const extensions  = requireAll(`${__dirname}/extensions`);
const filters     = requireAll(`${__dirname}/filters`);

module.exports = function(theme, app){

    const loader = new nunjucks.FileSystemLoader(theme.views(), {
        watch: false,
        noCache: true
    });

    const env = Promise.promisifyAll(new nunjucks.Environment(loader, {
        autoescape: false
    }));

    const frctl = {
        components: app.components,
        docs:       app.pages,
        config:     app.get(),
        theme:      theme,
        web:        null,
    };

    _.forEach(extensions, factory => {
        const e = factory(app, env);
        env.addExtension(e.name, new e.extension());
    });

    _.forEach(filters, factory => {
        const f = factory(app, env);
        env.addFilter(f.name, f.filter, f.async);
    });

    return {

        string(str, context, serverContext) {
            frctl.web = serverContext;
            env.addGlobal('frctl', frctl.web);
            return env.renderStringAsync(str, context || {});
        },

        template(path, context, serverContext) {
            frctl.web = serverContext;
            env.addGlobal('frctl', frctl.web);
            return env.renderAsync(path, context || {});
        }
    }

}

// module.exports = function (includePath, config, theme, app) {

    // config           = config || {};
    // const components = app.source('components');
    // const pages      = app.source('docs');
    //
    // const loader = new nunjucks.FileSystemLoader(includePath, {
    //     watch: false,
    //     noCache: true
    // });
    //
    // const env = Promise.promisifyAll(new nunjucks.Environment(loader, {
    //     autoescape: false
    // }));
    //
    // // Add configured
    // _.each(_.defaults(config.globals || {}),    (val, key) => env.addGlobal(key, val));
    // _.each(_.defaults(config.extensions || {}), (val, key) => env.addExtension(key, val));
    // _.each(_.defaults(config.filters || {}),    (val, key) => {
    //     return _.isFunction(val) ? env.addFilter(key, val) : env.addFilter(key, val.filter, val.async || false);
    // });

    // env.addFilter('context', (entity, cb) => {
    //     let ctx;
    //     if (entity.type == 'variant' || entity.type == 'component') {
    //         ctx = components.resolve(entity.context);
    //     } else if (entity.type == 'page') {
    //         ctx = pages.resolve(entity.context);
    //     } else {
    //         ctx = Promise.resolve(entity);
    //     }
    //     ctx.then(result => cb(null, result)).catch(cb);
    // }, true);
    //
    // env.addFilter('resolve', function() {
    //     let ctx;
    //     const args = Array.from(arguments);
    //     const cb = args.pop();
    //     const context = args[0];
    //     let type = 'component';
    //     if (!_.isUndefined(args[1])) {
    //         type = args[1];
    //     }
    //
    //     if (type == 'component') {
    //         ctx = components.resolve(context);
    //     } else if (type == 'page') {
    //         ctx = pages.resolve(context);
    //     } else {
    //         ctx = Promise.resolve(context);
    //     }
    //     ctx.then(result => cb(null, result)).catch(cb);
    // }, true);
    //
    // env.addFilter('render', function() {
    //     const args = Array.from(arguments);
    //     const cb = args.pop();
    //     const entity = args[0];
    //     let opts = null;
    //     if (!_.isUndefined(args[1])) {
    //         opts = args[1];
    //     }
    //     let rendered;
    //     if (!entity) {
    //         rendered = Promise.resolve(null);
    //     }
    //     if (_.isString(entity)) {
    //         rendered = pages.renderString(entity);
    //     }
    //     if (entity.type == 'variant' || entity.type == 'component') {
    //         rendered = components.render(entity, null, opts);
    //     } else if (entity.type == 'page') {
    //         rendered = pages.render(entity);
    //     }
    //     rendered.then(result => cb(null, result)).catch(cb);
    // }, true);
    //
    // env.addFilter('preview', (entity, cb) => {
    //     components.render(entity, null, {
    //         useLayout: true,
    //         collate: true
    //     }).then(result => cb(null, result)).catch(cb);
    // }, true);
    //
    // env.addFilter('async', (p, cb) => {
    //     Promise.resolve(p).then(result => cb(null, result)).catch(cb);
    // }, true);
    //
    // env.addFilter('stringify', (obj, format) => {
    //     format = format || 'json';
    //     format = format.toLowerCase();
    //     if (obj instanceof Buffer) {
    //         return obj.toString('UTF-8');
    //     }
    //     if (format === 'yaml' || format === 'yml') {
    //         return yaml.dump(obj);
    //     }
    //     return JSON.stringify(obj, null, 4);
    // });
    //
    // env.addFilter('inject', (html, injection) => {
    //     if (html.indexOf('</body>') !== -1) {
    //         html = html.replace('</body>', `\n${injection}\n</body>`);
    //     } else {
    //         html = `${html}\n${injection}`;
    //     }
    //     return html;
    // });
    //
    // env.addFilter('highlight', (str, lang) => {
    //     if (str && !_.isString(str) && _.isFunction(str.toString)) {
    //         str = str.toString();
    //     }
    //     return app.utils.highlight(str, lang);
    // });
    //
    // env.addFilter('linkHandles', (content, routeName, routeParam) => {
    //     content = content.replace(/\@[0-9a-zA-Z\-\_]*/g, function(handle){
    //         const params = {};
    //         params[routeParam] = handle.replace('@', '');
    //         try {
    //             const url = theme.urlFromRoute(routeName, params);
    //             return `<a href="${url}">${handle}</a>`;
    //         } catch(e) {
    //             return handle;
    //         }
    //     });
    //     return content;
    // });
    //
    // env.addFilter('parse', (str, context) => {
    //     return env.renderString(str, context || {});
    // });
    //
    // env.addExtension('Throw404', new Throw404());
    //
    // function setFrctl(globals){
    //     const frctl = {
    //         components: components,
    //         docs:       pages,
    //         config:     app.get(),
    //         theme:      theme,
    //     };
    //     Object.assign(frctl, theme.globals || {});
    //     Object.assign(frctl, globals || {});
    //     env.addGlobal('frctl', frctl);
    // }
    //
    // return {
    //     env: env,
    //     string: function (str, context, globals) {
    //         setFrctl(globals);
    //         return env.renderStringAsync(str, context || {});
    //     },
    //     template: function (path, context, globals) {
    //         setFrctl(globals);
    //         return env.renderAsync(path, context || {});
    //     }
    // };
// };
