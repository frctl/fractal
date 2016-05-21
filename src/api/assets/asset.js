'use strict';

const _     = require('lodash');
const File  = require('../files/file');

module.exports = class Asset extends File {

    constructor(file, relativeTo) {
        super(file, relativeTo);
        this.isAsset = true;
    }

    toJSON() {
        const self = super.toJSON();
        self.isAsset = true;
        return self;
    }

};
