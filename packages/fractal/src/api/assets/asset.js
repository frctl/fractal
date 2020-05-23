'use strict';

const _ = require('lodash');
const Path = require('path');
const File = require('../files/file');

module.exports = class Asset extends File {

    constructor(file, relativeTo, source) {
        super(file, relativeTo);
        this.isAsset = true;
        this._source = source;
        this.srcPath = Path.join(`${source.name}`, this.relPath);
    }

    toVinyl() {
        const file = super.toVinyl();
        file.srcPath = this.srcPath;
        return file;
    }

    toJSON() {
        const self = super.toJSON();
        self.isAsset = true;
        self.srcPath = this.srcPath;
        self[`is${this.ext.replace(/^\./, '').toUpperCase()}`] = true;
        return self;
    }

};
