'use strict';

const _     = require('lodash');
const utils = require('../utils');

module.exports = class Asset {

    constructor(file) {
        this.type        = 'asset';
        this._file       = file;
        this.path        = file.path;
        this.base        = file.base;
        this.handle      = utils.slugify(file.base.replace('.','-'));
        this.name        = file.name;
        this.ext         = file.ext;
        this.lang        = file.lang.name;
        this.editorMode  = file.lang.mode;
        this.editorScope = file.lang.scope;
        this.githubColor = file.lang.color;
        this.isBinary    = file.isBinary;
    }

    getContent() {
        return this._file.read().then(c => c.toString());
    }

    getContentSync() {
        return this._file.readSync().toString();
    }

    toJSON() {
        return {
            type: this.type,
        };
    }

};
