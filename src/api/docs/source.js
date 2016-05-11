'use strict';

const _            = require('lodash');
const Source       = require('../../core/source');

class DocSource extends Source {

    constructor(app){
        super('docs', app);
    }

    _parse(fileTree) {

    }
}

module.exports = DocSource;
