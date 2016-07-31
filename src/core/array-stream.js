'use strict';

const Readable = require('readable-stream').Readable;

module.exports = class ArrayStream extends Readable {

    constructor(items) {
        super({ objectMode: true });
        this._items = items;
        this._pointer = 0;
    }

    _read() {
        this.push(this._pointer < this._items.length ? this._items[this._pointer++] : null);
    }

};
