
var Promise = require('bluebird');
var _       = require('lodash');

var app     = require('./application');

module.exports = {

    load: function(){
        var self = this;
        return Promise.props({
            components: app.getComponents(),
            pages: app.getPages(),
        }).then(function(){
            return self;
        });
    },

    get components(){
        return this.getComponents();
    },

    get pages(){
        return this.getPages();
    },

    get config(){
        return this.getConfig();
    },

    get statuses(){
        return this.getStatuses();
    },

    getComponents: function(){
        return app.getComponents().value();
    },

    getPages: function(opts){
        return app.getPages().value();
    },

    getStatuses: function(){
        return app.getStatuses();
    },

    getConfig: function(path){
        if (path) {
            return app.get(path);
        }
        return app.get();
    }

};

function apiFactory(entities){
    //
    // function collect(collection, opts){
    //     if (opts.flatten && !opts.group) {
    //         collection = collection.flatten();
    //     } else if (opts.flatten && opts.group) {
    //         collection = collection.flattenWithGroups();
    //     }
    //     if (opts.hidden === false) {
    //         collection = collection.flattenWithGroups();
    //     }
    //     return collection;
    // }

    return {

        get components(){
            return this.getComponents();
        },

        get pages(){
            return this.getPages();
        },

        get config(){
            return this.getConfig();
        },

        get statuses(){
            return this.getStatuses();
        },

        getComponents: function(){
            return app.getComponents().value();
        },

        getPages: function(opts){
            return app.getPages().value();
        },

        getStatuses: function(){
            return entities.statuses;
        },

        getConfig: function(path){
            if (path) {
                return _.get(entities.config, path);
            }
            return entities.config;
        }
    }
}
