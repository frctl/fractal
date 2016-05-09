'use strict';

const _            = require('lodash');
const mix          = require('mixwith').mix;
const Vorpal       = require('vorpal');
const Base         = require('../core/mixins/base.js');
const Configurable = require('../core/mixins/configurable');
const Logger       = require('./logger');
const Commander    = require('./commander');

class Cli extends mix(Base).with(Configurable) {

    constructor(app){
        super(...arguments);
        this.scope     = 'project';
        this._vorpal   = new Vorpal();
        this.logger    = new Logger(this._vorpal, app);
        this.commander = new Commander(this._vorpal, this.logger, app);
    }

    theme(theme) {
        if (_.isString(theme)) {
            theme = require(theme);
        }
        this.logger.theme(theme);
        return this;
    }

    command() {
        this.commander.add(...arguments);
        return this;
    }

    exec() {
        return this.commander.exec(...arguments);
    }

}

module.exports = Cli;
