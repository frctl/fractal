'use strict';

const _ = require('lodash');
const utils = require('@frctl/fractal').utils;
const Path = require('path');
const Adapter = require('@frctl/fractal').Adapter;

class TwigAdapter extends Adapter {

    constructor(Twig, source, app, config) {

        super(Twig, source);
        this._app = app;
        this._config = config;

        let self = this;

        Twig.extend(function(Twig) {

            /*
             * Register a Fractal template loader. Locations can be handles or paths.
             */

            Twig.Templates.registerLoader('fractal', function(location, params, callback, errorCallback) {

                let view = isHandle(location) ? self.getView(location) : _.find(self.views, {path: Path.join(source.fullPath, location)});
                if (!view) {
                    throw new Error(`Template ${location} not found`);
                }

                params.data = view.content;

                return new Twig.Template(params);
            });

            /*
             * Monkey patch the render method to make sure that the _self variable
             * always refers to the actual component/sub-component being rendered.
             * Without this _self would always refer to the root component.
             */

            const render = Twig.Template.prototype.render;
            Twig.Template.prototype.render = function(context, params) {

                let handle = null;
                console.log('--------');
                console.log(this);
                console.log('--------');
                if (isHandle(this.id)) {
                    handle = this.id;
                } else {
                    let view = _.find(self.views, {path: Path.join(source.fullPath, this.id)});
                    if (view) {
                        handle = view.handle;
                    }
                }

                if (handle) {
                    let entity = source.find(handle);
                    if (entity) {
                        entity = entity.isComponent ? entity.variants().default() : entity;
                        if (config.importContext) {
                            context = utils.defaultsDeep(context, entity.getContext());
                        }
                        context._self = entity.isComponent ? entity.variants().default().toJSON() : entity.toJSON();
                    }
                }

                return render.call(this, context, params);
            };

            /*
             * Twig caching is enabled for better perf, so we need to
             * manually update the cache when a template is updated or removed.
             */

            Twig.cache = true;

            self.on('view:updated', unCache);
            self.on('view:removed', unCache);

            function unCache(view) {

                let path = Path.relative(source.fullPath, view.path);

                if (Twig.Templates.registry[view.handle]) {
                    delete Twig.Templates.registry[view.handle];
                }
                if (Twig.Templates.registry[path]) {
                    delete Twig.Templates.registry[path];
                }
            }

        });

        function isHandle(str) {
            return str && str.startsWith(self._config.handlePrefix);
        }
    }

    get twig() {
        return this._engine;
    }

    render(path, str, context, meta) {

        let self = this;

        meta = meta || {};

        setEnv('_self', meta.self, context);
        setEnv('_target', meta.target, context);
        setEnv('_env', meta.env, context);
        setEnv('_config', this._app.config(), context);

        return new Promise(function(resolve, reject){

            try {
                let template = self.engine.twig({
                    method: 'fractal',
                    async: false,
                    name: `${self._config.handlePrefix}${meta.self.handle}`,
                    rethrow: true
                });
                resolve(template.render(context));
            } catch (e) {
                reject(new Error(e));
            }

        });

        function setEnv(key, value, context) {
            if (context[key] === undefined && value !== undefined) {
                context[key] = value;
            }
        }
    }

}

module.exports = function(config) {

    config = _.defaults(config || {}, {
        handlePrefix: '@',
        importContext: true
    });

    return {

        register(source, app) {

            const Twig = require('twig');

            if (!config.pristine) {
                _.each(require('./functions')(app) || {}, function(func, name){
                    Twig.extendFunction(name, func);
                });
                _.each(require('./filters')(app), function(filter, name){
                    Twig.extendFilter(name, filter);
                });
                _.each(require('./tests')(app), function(test, name){
                    Twig.extendTest(name, test);
                });
                Twig.extend(function(Twig) {
                    _.each(require('./tags')(app), function(tag){
                        Twig.exports.extendTag(tag(Twig));
                    });
                });
            }

            _.each(config.functions || {}, function(func, name){
                Twig.extendFunction(name, func);
            });
            _.each(config.filters || {}, function(filter, name){
                Twig.extendFilter(name, filter);
            });
            _.each(config.tests || {}, function(test, name){
                Twig.extendTest(name, test);
            });
            Twig.extend(function(Twig) {
                _.each(config.tags || {}, function(tag){
                    Twig.exports.extendTag(tag(Twig));
                });
            });

            return new TwigAdapter(Twig, source, app, config);
        }
    }

};
