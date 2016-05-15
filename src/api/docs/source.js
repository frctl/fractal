'use strict';

const _            = require('lodash');
const EntitySource = require('../../core/entities/source');

class DocSource extends EntitySource {

    constructor(app){
        super('docs', app);
    }

    _parse(fileTree) {

    }
}

module.exports = DocSource;
