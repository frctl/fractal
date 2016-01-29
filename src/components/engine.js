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
        const moduleName = config.get('components.view.engine');
        handler = require(moduleName);
        handler.extend(config.get('components.view.extend'));
        return handler;
    } catch (e) {
        throw new Error(`The component view engine '${moduleName}' could not be loaded: ${e.message}`);
    }
}

function loadViews(){

}
