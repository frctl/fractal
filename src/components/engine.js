'use strict';

const config = require('../config');

let conf = null;
let handler = null;

module.exports = {

    get config(){
        if (conf) {
            return conf;
        }
        const engineName = config.get('components.view.engine');
        conf = config.get(`components.engines.${engineName}`, null);
        if (!conf) {
            throw new Error(`The component view engine '${engineName}' was not recognised.`);
        }
        conf.ext = conf.ext.toLowerCase();
        return conf;
    },

    get handler(){
        if (handler) {
            return handler;
        }
        try {
            handler = require(this.config.handler);
            handler.init(this.config);
            return handler;
        } catch (e) {
            logger.warn(e.message);
            throw new Error(`The component view engine '${this.config.handler}' could not be found.`);
        }
    }

};
