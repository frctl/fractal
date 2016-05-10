'use strict';

const mix          = require('mixwith').mix;
const Base         = require('../core/mixins/base');
const Configurable = require('../core/mixins/configurable');

class Web extends mix(Base).with(Configurable) {

    constructor(app){
        super(app);
        this.setConfig(app.get('web'));
    }

    start() {

    }

    build() {

    }

}

module.exports = Web;
