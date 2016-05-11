'use strict';

const mix          = require('../core/mixins/mix');
const Configurable = require('../core/mixins/configurable');

module.exports = class Theme extends mix(Configurable) {

    constructor(config, app){
        super(app);
    }

}
