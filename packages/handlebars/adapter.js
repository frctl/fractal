'use strict';

const promisedHbs = require('promised-handlebars');
const Handlebars  = require('handlebars');
const helpers     = require('@frctl/handlebars-helpers');
const _           = require('lodash');

module.exports = function(source, config){

    config               = config || {};
    let instance         = Handlebars;
    let instanceHelpers  = {};
    let instancePartials = {};

    if (config.instance) {
        const defaultInstance = Handlebars.create();
        _.each(config.instance.helpers || {}, (helper, name) => {
            if (!defaultInstance.helpers[name]) {
                instanceHelpers[name] = helper;
            }
        });
        _.each(config.instance.partials || {}, (partial, name) => {
            if (!defaultInstance.partials[name]) {
                instancePartials[name] = partial;
            }
        });
        instance = config.instance;
    }

    instance = promisedHbs(instance);

    let viewsLoaded = false;

    if (config.loadHelpers) {
        helpers.use(source._app);
        _.each(helpers.require('helpers') || {}, function(helper, name){
            instance.registerHelper(name, helper);
        });
        _.each(helpers.require('partials') || {}, function(partial, name){
            instance.registerPartial(name, partial);
        });
    }

    _.each(_.defaults(instanceHelpers, config.helpers || {}), function(helper, name){
        instance.registerHelper(name, helper);
    });
    _.each(_.defaults(instancePartials, config.partials || {}), function(partial, name){
        instance.registerPartial(name, partial);
    });

    function loadViews() {
        for (let item of source.flattenDeep()) {
            instance.registerPartial('@' + item.handle, item.content);
            if (item.alias) {
                instance.registerPartial('@' + item.alias, item.content);
            }
        }

        viewsLoaded = true;
    }

    source.on('loaded', loadViews);
    source.on('changed', loadViews);

    return {
        engine: instance,
        render: function(path, str, context, meta){
            if (!viewsLoaded) loadViews(source);
            const template = instance.compile(str);
            return Promise.resolve(template(context));
        }
    }
};
