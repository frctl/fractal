'use strict';

const mix          = require('mixwith').mix;
const Base         = require('../core/mixins/base.js');
const Configurable = require('../core/mixins/configurable');

class Web extends mix(Base).with(Configurable) {

    start() {

    }

    build() {

    }

}

module.exports = Web;
