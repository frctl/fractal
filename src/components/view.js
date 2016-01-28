'use strict';

const config = require('../config');

let engine = null;

module.exports = {

    get engine(){
        if (engine) {
            return engine;
        }
        const engineName = config.get('components.view.engine');
        engine = config.get(`components.engines.${engineName}`, null);
        if (!engine) {
            throw new Error(`Components view engine '${engineName}' not recognised.`);
        }
        engine.ext = engine.ext.toLowerCase();
        return engine;
    },

    render(entity){

    }

};
