'use strict';

const Handlebars = require('handlebars');

module.exports = function(fractal){

    return function context(handle){
        const source = fractal.components;
        const entity = source.find(handle);
        if (!entity) {
            throw new Error(`Could not get context for component '${handle}' - component not found.`);
        }
        const context = entity.isComponent ? entity.variants().default().context : entity.context;
        return source.resolve(context).then(ctx => new Handlebars.SafeString(JSON.stringify(ctx, null, 4)));
    };

};
