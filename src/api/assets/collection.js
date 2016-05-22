'use strict';

const _                = require('lodash');
const FileCollection   = require('../files/collection');
const streamify        = require('stream-array');

module.exports = class AssetCollection extends FileCollection {

    constructor(config, items){
        super(config, items);
    }

    assets() {
        return this.newSelf(this.toArray().filter(i => i.isAsset));
    }

}
