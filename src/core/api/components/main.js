'use strict';

const mix          = require('mixwith').mix;
const Base         = require('../../mixins/base.js');
const Configurable = require('../../mixins/configurable');
const Source       = require('../../mixins/source');
const Collection   = require('../../mixins/collection');
const Emitter      = require('../../mixins/emitter');

class ComponentSource extends mix(Base).with(Configurable, Source, Emitter) {

    constructor(app){
        super();
        this.name    = 'components';
        this._app    = app;
        this._config = app.get(this.name);
    }

}

module.exports = ComponentSource;
