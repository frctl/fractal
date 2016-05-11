'use strict';

const mix          = require('../core/mixins/mix');
const Emitter      = require('../core/mixins/emitter');

module.exports = class Builder extends mix(Emitter) {

    constructor(theme, config, app){
        super(app);
        this._config   = config;
        this._theme    = theme;
    }

}
