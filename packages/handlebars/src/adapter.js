'use strict';

const _           = require('lodash');
const promisedHbs = require('promised-handlebars');
const Path        = require('path');
const Handlebars  = require('handlebars');


module.exports = function(config){

    config               = config || {};
    if (_.isUndefined(config.loadHelpers)) {
        config.loadHelpers = true;
    }
    let hbs              = promisedHbs(Handlebars);
    let partials         = [];

    function registerPartial(path, handle, content) {
        handle = `@${handle}`;
        partials.push({
            path: path,
            handle: handle,
            content: content
        });
        hbs.registerPartial(handle, content);
    }

    return {

        get engine(){
            return hbs;
        },

        register(source, app) {

            function loadViews(changeData) {
                if (changeData && changeData.isTemplate) {
                    let touched = _.filter(partials, ['path', Path.resolve(changeData.path)]);
                    if (changeData.event === 'change') {
                        touched.forEach(p => {
                            let entity = source.find(p.handle);
                            if (entity) {
                                registerPartial(entity.viewPath, entity.alias, entity.content);
                            }
                        });
                        return;
                    } else if (changeData.event === 'unlink') {
                        touched.forEach(p => {
                            let entity = source.find(p.handle);
                            if (entity) {
                                registerPartial(entity.viewPath, entity.alias, entity.content);
                            }
                        });
                        partials = _.differenceBy(partials, touched, 'path');
                        return;
                    }
                    // add - just run though the full rebuild process.
                    changeData = null;
                }

                if (!changeData) {
                    for (let item of source.flattenDeep()) {
                        registerPartial(item.viewPath, item.handle, item.content);
                        if (item.alias) {
                            registerPartial(item.viewPath, item.alias, item.content);
                        }
                    }
                }
            }

            if (config.loadHelpers) {
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

            source.on('loaded', data => loadViews());
            source.on('changed', data => loadViews(data));

            loadViews();
        },

        render(path, str, context, meta) {
            const template = hbs.compile(str);
            return template(context);
        }

    }
};
