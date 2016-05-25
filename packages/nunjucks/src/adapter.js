'use strict';

const _        = require('lodash');
const Promise = require('bluebird');
const nunjucks = require('nunjucks');
const Adapter     = require('@frctl/fractal').Adapter;

class NunjucksAdapter extends Adapter {

    constructor(source, loadPaths) {

        super(null, source);

        const loaders = [];
        const self = this;

        /**
         * Create a custom string loader and instantiate a new Nunjucks environment object with it.
         * We don't want to use the FileSystemLoader as we already have
         * the contents of all files cached in the component file tree.
         */

        const StringLoader = nunjucks.Loader.extend({
            getSource: function(handle) {
                if (handle.indexOf('@') !== 0) {
                    return;
                }
                const view = self.getView(handle);
                if (view) {
                    return {
                        src: view.content,
                        path: view.content,
                        noCache: true
                    };
                }
            }
        });
        loaders.push(new StringLoader());

        /**
         * If the user has specified any paths for directly loading templates,
         *  include a FileSystemLoader instance.
         */

        if (loadPaths) {
            loaders.push(new nunjucks.FileSystemLoader(loadPaths, {
                watch: true
            }));
        }

        /**
         * Instantiate the Nunjucks environment instance.
         */

        let nj = Promise.promisifyAll(new nunjucks.Environment(loaders, {
            autoescape: false
        }));

        this._engine = nj;
    }

    render(path, str, context, meta) {
        return this.engine.renderStringAsync(str, context);
    }

}

module.exports = function(config) {

    config = config || {};

    return {

        register(source, app) {

            const adapter = new NunjucksAdapter(source, config.paths);
            const nj = adapter.engine;

            if (!config.pristine) {
                _.each(require('./filters')(app) || {}, function(filter, name){
                    addFilter(name, filter);
                });
                _.each(require('./extensions')(app) || {}, function(ext, name){
                    nj.addExtension(name, ext);
                });
            }

            _.each(config.filters || {}, function(filter, name){
                addFilter(name, filter);
            });
            _.each(config.extensions || {}, function(ext, name){
                nj.addExtension(name, ext);
            });
            _.each(config.globals || {}, function(value, name){
                nj.addGlobal(name, value);
            });

            function addFilter(name, filter){
                if (typeof filter === 'function') {
                    nj.addFilter(name, filter);
                } else if (typeof filter === 'object') {
                    nj.addFilter(name, filter.filter, filter.async);
                }
            }

            return adapter;
        }
    }

};
