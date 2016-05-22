'use strict';

const _    = require('lodash');
const Path = require('path');
const File = require('../files/file');

module.exports = class Asset extends File {

    constructor(file, relativeTo, source) {
        super(file, relativeTo);
        this.isAsset = true;
        this._source = source;
        this.sourcePath = Path.join(`${source.name}`, this.relPath);
    }

    toVinyl() {
        const file = super.toVinyl();
        file.sourcePath = this.sourcePath;
        file.contents   = this.contents;
        return file;
    }

    toJSON() {
        const self = super.toJSON();
        self.isAsset = true;
        self.sourcePath = sourcePath;
        return self;
    }

};
