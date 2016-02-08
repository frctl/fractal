'use strict';

const _      = require('lodash');
const Source = require('../source');

module.exports = class ComponentSource extends Source {

    constructor(props, items) {
        super(props, items);
        this.status  = props.status;
        this.preview = props.preview;
        this.display = props.display;
    }


}
