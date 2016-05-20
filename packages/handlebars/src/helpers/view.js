'use strict';

const Handlebars = require('handlebars');

module.exports = function(fractal){

    return function view(handle){
        const source = fractal.components;
        let entity = source.find(handle);
        if (!entity) {
            throw new Error(`Could not get view contents for component '${handle}' - component not found.`);
        }
        if (entity.isComponent) {
            entity = entity.variants().default();
        }
        return entity.getContent().then(content => new Handlebars.SafeString(content));
    };

};
