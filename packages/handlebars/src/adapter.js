'use strict';

const path        = require('path');
const _           = require('lodash');
const Promise     = require('bluebird');
const promisedHbs = require('promised-handlebars');
const Handlebars  = require('handlebars');
const Adapter     = require('@frctl/fractal').Adapter;

class HandlebarsAdapter extends Adapter {

    constructor(hbs, source, app) {
        super(hbs, source);
        this._app = app;
        this.on('view:added',   view => this.engine.registerPartial(view.handle, view.content));
        this.on('view:added',   view => this.engine.registerPartial(path.relative(source.get('path'), view.path), view.content));
        this.on('view:removed', view => this.engine.unregisterPartial(view.handle));
        this.on('view:removed', view => this.engine.unregisterPartial(path.relative(source.get('path'), view.path)));
        this.on('view:updated', view => this.engine.registerPartial(view.handle, view.content));
        this.on('view:updated', view => this.engine.registerPartial(path.relative(source.get('path'), view.path), view.content));
    }

    get handlebars() {
        return this._engine;
    }

    render(path, str, context, meta) {
        meta = meta || {};
        setEnv('_self', meta.self, context);
        setEnv('_target', meta.target, context);
        setEnv('_env', meta.env, context);
        setEnv('_config', this._app.config(), context);
        const template = this.engine.compile(str);
        return this._resolve(template(context));
    }

}

function setEnv(key, value, context) {
    if (_.isUndefined(context[key]) && ! _.isUndefined(value)) {
        context[key] = value;
    }
}

module.exports = function(config) {

    config = config || {};

    return {

        register(source, app) {

            const hbs = promisedHbs(Handlebars, {
                Promise: Promise
            });

            const invokePartial = hbs.VM.invokePartial;
            hbs.VM.invokePartial = function() {
                const args = Array.from(arguments);
                const identifier = args[2].name;
                let entity;
                if (identifier.indexOf('@') === 0) {
                    entity = app.components.find(identifier);
                } else {
                    entity = app.components.find('viewPath', identifier);    
                }

                if (entity) {
                    args[2].data.root._self = entity.isComponent ? entity.variants().default().toJSON() : entity.toJSON();
                } else {
                    args[2].data.root._self = null;
                }
                return invokePartial.apply(hbs.VM, args);
            };

            const adapter = new HandlebarsAdapter(hbs, source, app);

            if (!config.pristine) {
                _.each(require('./helpers')(app) || {}, function(helper, name){
                    hbs.registerHelper(name, helper);
                });
                _.each(require('./partials')(app) || {}, function(partial, name){
                    hbs.registerPartial(name, partial);
                });
            }

            _.each(config.helpers, function(helper, name){
                hbs.registerHelper(name, helper);
            });
            _.each(config.partials, function(partial, name){
                hbs.registerPartial(name, partial);
            });

            return adapter;
        }
    }

};
