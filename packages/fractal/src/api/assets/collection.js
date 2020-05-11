'use strict';

const _ = require('lodash');
const FileCollection = require('../files/collection');

module.exports = class AssetCollection extends FileCollection {

    constructor(config, items) {
        super(config, items);
    }

    assets() {
        return this.newSelf(this.toArray().filter(i => i.isAsset));
    }

    toVinylArray() {
        return this.filter('isAsset').flatten().map(asset => asset.toVinyl()).toArray();
    }

};
