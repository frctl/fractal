'use strict';

const config = require('../config');
const logger = require('../logger');

const handler = null;

module.exports = function(str, context, preview){
    context = context || {};
    preview = preview || null;
    const handler = getHandler();
    
};

function getHandler(){
    if (handler) {
        return handler;
    }
    try {
        const handlerName = config.get('components.view.config.handler');
        handler = require(handlerName);
        handler.init(engineConf);
        return handler;
    } catch (e) {
        throw new Error(`The component view engine '${handlerName}' could not be loaded: ${e.message}`);
    }
}

function loadViews(){

}
