'use strict';

const Promise = require('bluebird');

module.exports = class Page {
    constructor(path) {
        this.type = 'page';
        this.path = path;
    }
    static create(file, dir){
        return Promise.resolve(new Page(file.path));
    }
}
